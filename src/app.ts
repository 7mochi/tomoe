import fastifyRateLimit from "@fastify/rate-limit";
import Winston from "winston";
import { Config } from "./util/config";
import { Logger } from "./util/logger";
import { Database } from "./database";
import { fastify } from "fastify";
import v1 from "./router/v1";
import v2 from "./router/v2";
export class App {
	public static instance = new App();

	public app = fastify({
		logger: false,
		trustProxy: true,
	});
	public database: Database;

	public config: Config;
	public logger: Winston.Logger;

	constructor() {
		this.config = new Config();
		this.logger = Logger.get();

		this.database = new Database(
			this.config.database.connectionLimitPool,
			this.config.database.host,
			this.config.database.port,
			this.config.database.user,
			this.config.database.password,
			this.config.database.database
		);
	}

	async start(): Promise<void> {
		this.app.register(fastifyRateLimit, {
			max: this.config.api.ratelimit.requests,
			timeWindow: this.config.api.ratelimit.timeWindow,
		});

		this.app.register(v1, { prefix: "/v1" });
		this.app.register(v2, { prefix: "/v2" });

		this.app.listen(
			{
				port: this.config.api.port,
				host: this.config.api.host,
			},
			() => {
				this.logger.info(
					`Listening requests on ${this.config.api.publicUrl}`
				);
			}
		);
	}

	async stop(): Promise<void> {
		this.logger.info("Stopping app...");

		this.app.close().then(
			() => {
				this.logger.info("Server closed succesfully!");
			},
			(err) => {
				this.logger.error(
					"Error during the HTTP server shutdown.",
					err
				);
			}
		);
	}
}

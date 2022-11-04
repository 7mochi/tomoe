import express from "express";
import http from "http";
import https from "https";
import { Config } from "./util/config";
import { Logger } from "./util/logger";
import * as fs from "fs";
import { Database } from "./database";
import Winston from "winston";
import { ApiV1Router } from "./router/v1/index";
import rlimit from "express-rate-limit";

export class App {
	public static instance = new App();

	public app = express();

	public httpServer: http.Server;
	public httpsServer?: https.Server;
	public database: Database;

	public config: Config;
	public logger: Winston.Logger;

	constructor() {
		this.config = new Config();
		this.logger = Logger.get();

		this.httpServer = http.createServer(this.app);
		this.database = new Database(
			this.config.database.connectionLimitPool,
			this.config.database.host,
			this.config.database.port,
			this.config.database.user,
			this.config.database.password,
			this.config.database.database
		);

		if (this.config.enableHttps) {
			this.httpsServer = https.createServer({
				key: fs.readFileSync(
					this.config.api.https.privateKeyPath,
					"utf8"
				),
				cert: fs.readFileSync(
					this.config.api.https.certificatePath,
					"utf8"
				),
			});
		}
	}

	async start(): Promise<void> {
		const rateLimiter = rlimit({
			windowMs: this.config.api.ratelimit.time,
			max: this.config.api.ratelimit.requests,
			message: "You have been rate-limited.",
		});
		this.app.use("/api/v1", rateLimiter, new ApiV1Router().router);
		this.app.disable("x-powered-by");

		this.httpServer.listen(
			this.config.api.http.port,
			this.config.api.http.host,
			() => {
				this.logger.info(
					`Listening HTTP requests on ${this.config.api.http.publicUrl}`
				);
			}
		);

		this.httpsServer?.listen(
			this.config.api.https.port,
			this.config.api.https.host,
			() => {
				this.logger.info(
					`Listening HTTPS requests on ${this.config.api.https.publicUrl}`
				);
			}
		);

		this.httpServer.on("error", () => {
			this.logger.error(
				`An error occurred while listening to HTTP requests on ${this.config.api.http.publicUrl}`
			);
		});

		this.httpsServer?.on("error", () => {
			this.logger.error(
				`An error occurred while listening to HTTPS requests on ${this.config.api.http.publicUrl}`
			);
		});
	}

	async stop(): Promise<void> {
		this.logger.info("Stopping app...");

		this.httpServer.close((error) => {
			if (error) {
				this.logger.error(
					"Error during the HTTP server shutdown.",
					error
				);
			}
		});

		this.httpsServer?.close((error) => {
			if (error) {
				this.logger.error(
					"Error during the HTTPS server shutdown.",
					error
				);
			}
		});
	}
}

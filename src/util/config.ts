import * as fs from "fs";
import _ from "lodash";

export class Config {
	public enableHttps: boolean;
	public bpyApiUrl: string;
	public requireApiKey: boolean;
	
	public api = {
		http: {
			host: "",
			port: 5000,
			publicUrl: "",
		},
		https: {
			host: "",
			port: 5443,
			publicUrl: "",
			certificatePath: "",
			privateKeyPath: "",
		},
		ratelimit: {
			requests: 500,
			time: 300000
		}
	}

	public database = {
		connectionLimitPool: 100,
		host: "",
		port: 3306,
		user: "",
		password: "",
		database: ""
	}

	constructor() {
		this.load();
	}

	public load(configPath = "config.json"): void {
		this.parse(
			fs.readFileSync(configPath).toString(),
			fs.readFileSync("config.default.json").toString()
		)
	}

	public parse(content: string, defaultContent: string): void {
		const contentJSON = JSON.parse(content);
		const defaultContentJSON = JSON.parse(defaultContent);
		const configObj = _.defaultsDeep(contentJSON, defaultContentJSON) as Config;

		Object.entries(configObj).forEach(([key, value]) => {
			this[key] = value;
		});
	}
}

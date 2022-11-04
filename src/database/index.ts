import mysql, { Pool } from "mysql2/promise";
import { App } from "../app";

export class Database {
	private pool: Pool;

	constructor(
		connectionLimit: number,
		host: string,
		port: number,
		user: string,
		password: string,
		database: string
	) {
		this.pool = mysql.createPool({
			connectionLimit: connectionLimit,
			host: host,
			port: port,
			user: user,
			password: password,
			database: database,
		});
	}

	async query(sql: string, values?: unknown | unknown[]): Promise<unknown> {
		try {
			const [result] = await this.pool.query(sql, values);
			return result;
		} catch (e) {
			App.instance.logger.error(e);
		}
	}
}

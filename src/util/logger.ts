import Winston from "winston";
import WinstonDailyRotateFile from "winston-daily-rotate-file";

export abstract class Logger {
	static transports = [
		new Winston.transports.Console({
			level: "unprioritized",
			format: Winston.format.simple(),
		}),
		new WinstonDailyRotateFile({
			dirname: "data/logs/",
			filename: "%DATE%.log",
			level: "info",
		}),
	];

	static get(label?: string): Winston.Logger {
		return Winston.createLogger({
			format: Winston.format.combine(
				Winston.format.label({ label }),
				Winston.format.timestamp(),
				Winston.format.json()
			),
			transports: Logger.transports,
			levels: {
				error: 0,
				warn: 1,
				success: 2,
				info: 3,
				unprioritized: 4,
			},
		});
	}
}

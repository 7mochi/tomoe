import { Handler } from "express";
import { App } from "../app";
import { ErrorApiBancho } from "../common/types";
import { BpyDb } from "../util/bpy-db";

const withApiKey: Handler = async (req, res, next) => {
	const requireApiKey = await App.instance.config.requireApiKey;
	const key = req.query.k as string;
	
	if (requireApiKey) {
		const isValid = await BpyDb.isApiKeyValid(key);

		if (!isValid) {
			const output: ErrorApiBancho = {
				error: "Please provide a valid API key.",
			};
			res.status(401).json(output);
		} else {
			next();
		}
	} else {
		next();
	}
};

export { withApiKey };

import { FastifyRequest, FastifyReply } from "fastify";
import { App } from "../app";
import { BpyDb } from "../util/bpy-db";

export default async function (
	req: FastifyRequest,
	reply: FastifyReply
): Promise<unknown> {
	const requireApiKey = await App.instance.config.requireApiKey;
	const key = req.query["k"] as string;

	if (requireApiKey) {
		const isValid = await BpyDb.isApiKeyValid(key);

		if (!isValid) {
			return reply.code(401).send({
				error: "Please provide a valid API key.",
			});
		}
	}
}

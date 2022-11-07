import { FastifyInstance } from "fastify";
import apiKey from "../../middlewares/api-key";
import replay from "./replay";
import scores from "./scores";
import user from "./user";
import userBest from "./user-best";
import userRecent from "./user-recent";

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.get("/get_replay", { preHandler: apiKey }, replay);
	fastify.get("/get_scores", { preHandler: apiKey }, scores);
	fastify.get("/get_user", { preHandler: apiKey }, user);
	fastify.get("/get_user_best", { preHandler: apiKey }, userBest);
	fastify.get("/get_user_recent", { preHandler: apiKey }, userRecent);
}

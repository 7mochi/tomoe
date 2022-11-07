import { FastifyInstance } from "fastify";
import user from "./user";

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.get("/users/:user/:mode?", user);
    // TODO: /:user/scores/:type
}

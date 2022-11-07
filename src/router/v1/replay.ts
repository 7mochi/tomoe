import { FastifyRequest, FastifyReply } from "fastify";
import { UserBpyDb } from "../../common/types";
import { BpyApi } from "../../util/bpy-api";
import { BpyDb } from "../../util/bpy-db";
import { Misc } from "../../util/misc";

/**
 * Query parameters:
 * 'k' -> API Key (Required)
 * 'b' -> Beatmap ID in which the replay was played (Required)
 * 'u' -> UserID or username (Required)
 * 'm' -> Gamemode integer. 0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania. (Optional, default value is 0)
 * 's' -> Specify a score ID to retrieve the replay data for. May be passed insted of b and u
 * 'type' -> Specify if the query parameter 'u' is a User ID or a username. Use 'string' for usernames
 *         or 'id' for user IDs. (Optional, default behaviour is automatic recognition)
 * 'mods' -> Specify a mod or mod combination
 *
 * More info:
 * https://github.com/ppy/osu-api/wiki#apiget_replay
 * https://osu.ppy.sh/wiki/es/Client/File_formats/Osr_%28file_format%29
 */
export default async function (
	req: FastifyRequest,
	reply: FastifyReply
): Promise<FastifyReply> {
	const beatmapID = req.query["b"];
	const userToSearch = req.query["u"] as string;
	let gamemode = req.query["m"] as string | number;
	const scoreID = req.query["s"];
	let mods = req.query["mods"] as string | number;
	const type = req.query["type"];

	if (!beatmapID) return reply.send([]);

	if (scoreID) {
		return reply.send([]); // TODO: To be implemented
	} else {
		if (gamemode < 0 || gamemode > 3 || !Misc.isNumeric(gamemode)) gamemode = 0;
		if (!Misc.isNumeric(mods)) mods = 0;

		let user: UserBpyDb;
		let isUserID = false;
		switch (type) {
			case "u": {
				isUserID = true;
				break;
			}
			default: {
				if (Misc.isNumeric(userToSearch)) {
					isUserID = true;
				}
			}
		}

		if (isUserID) {
			user = await BpyDb.getUserByID(Number(userToSearch));
		} else {
			user = await BpyDb.getUserByUsername(userToSearch);
		}

		const beatmap = await BpyDb.getBeatmapByID(Number(beatmapID));

		const scores = await BpyDb.getBeatmapScores(
			beatmap.md5,
			Number(mods),
			Number(gamemode),
			user.id
		);

		return reply.send({
			content: await BpyApi.getLZMAReplayByID(scores[0].id),
			encoding: "base64",
		});
	}
}

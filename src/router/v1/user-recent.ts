import { FastifyRequest, FastifyReply } from "fastify";
import moment from "moment";
import { UserBpyDb, UserRecentBancho } from "../../common/types";
import { BpyApi } from "../../util/bpy-api";
import { BpyDb } from "../../util/bpy-db";
import { Misc } from "../../util/misc";

/**
 * Query parameters:
 * 'k' -> API key (Required)
 * 'u' -> User ID or username (Required)
 * 'm' -> Gamemode integer. 0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania. (Optional, default value is 0)
 * 'limit' -> Amount of results. Range between 1 and 50. (Optional, defaults to 10)
 * 'type' -> Specify if the query parameter 'u' is a User ID or a username. Use 'string' for usernames
 *           or 'id' for user IDs. (Optional, default behaviour is automatic recognition)
 *
 * More info: https://github.com/ppy/osu-api/wiki#recently-played
 */
export default async function (
	req: FastifyRequest,
	reply: FastifyReply
): Promise<FastifyReply> {
	const userToSearch = req.query["u"] as string;
	let gamemode = req.query["m"] as string | number;
	let limit = req.query["limit"] as string | number;
	const type = req.query["type"];

	if (gamemode < 0 || gamemode > 3 || !Misc.isNumeric(gamemode)) gamemode = 0;
	if (limit < 1 || limit > 100 || !limit) limit = 10;

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

	if (!user) return reply.send([]);

	const scores = await BpyApi.getUserScoresByID(
		user.id,
		"recent",
		Number(gamemode),
		Number(limit)
	);

	const output: UserRecentBancho[] = [];
	for (const score of scores.scores) {
		output.push({
			beatmap_id: `${score.beatmap.id}`,
			score: `${score.score}`,
			maxcombo: `${score.max_combo}`,
			count50: `${score.n50}`,
			count100: `${score.n100}`,
			count300: `${score.n300}`,
			countmiss: `${score.nmiss}`,
			countkatu: `${score.nkatu}`,
			countgeki: `${score.ngeki}`,
			perfect: `${score.perfect}`,
			enabled_mods: `${score.mods}`,
			user_id: `${scores.player.id}`,
			date: `${moment(score.play_time)
				.utc()
				.format("YYYY-MM-DD HH:MM:SS")}`,
			rank: `${score.grade}`,
		});
	}
	return reply.send(output);
}

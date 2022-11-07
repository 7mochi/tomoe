import { FastifyRequest, FastifyReply } from "fastify";
import moment from "moment";
import { UserBestBancho, UserBpyDb } from "../../common/types";
import { BpyDb } from "../../util/bpy-db";
import { Misc } from "../../util/misc";

/**
 * Query parameters:
 * 'k' -> API key (Required)
 * 'u' -> User ID or username (Required)
 * 'm' -> Gamemode integer. 0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania. (Optional, default value is 0)
 * 'limit' -> Amount of results. Range between 1 and 100. (Optional, defaults to 10)
 * 'type' -> Specify if the query parameter 'u' is a User ID or a username. Use 'string' for usernames
 *           or 'id' for user IDs. (Optional, default behaviour is automatic recognition)
 *
 * More info: https://github.com/ppy/osu-api/wiki#apiget_user_best
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

	const topPlays = await BpyDb.getUserTopPlays(
		user.id,
		Number(gamemode),
		Number(limit)
	);

	const output: UserBestBancho[] = [];
	for (const play of topPlays) {
		output.push({
			beatmap_id: `${play.beatmap_id}`,
			score_id: `${play.id}`,
			score: `${play.score}`,
			maxcombo: `${play.max_combo}`,
			count50: `${play.n50}`,
			count100: `${play.n100}`,
			count300: `${play.n300}`,
			countmiss: `${play.nmiss}`,
			countkatu: `${play.nkatu}`,
			countgeki: `${play.ngeki}`,
			perfect: `${play.perfect}`,
			enabled_mods: `${play.mods}`,
			user_id: `${play.userid}`,
			date: `${moment(play.play_time)
				.utc()
				.format("YYYY-MM-DD HH:MM:SS")}`,
			rank: `${play.grade}`,
			pp: `${play.pp}`,
			replay_available: `${play.online_checksum ? 1 : 0}`,
		});
	}
	return reply.send(output);
}

import { FastifyRequest, FastifyReply } from "fastify";
import moment from "moment";
import { BeatmapScoreBancho, UserBpyDb } from "../../common/types";
import { BpyDb } from "../../util/bpy-db";
import { Misc } from "../../util/misc";

/**
 * Query parameters:
 * 'k' -> API key (Required)
 * 'b' -> Beatmap ID to return scores information from (Required)
 * 'u' -> User ID or username (Required)
 * 'm' -> Gamemode integer. 0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania. (Optional, default value is 0)
 * 'mods' -> Specify a mod or mod combination [Bitwise]
 * 'type' -> Specify if the query parameter 'u' is a User ID or a username. Use 'string' for usernames
 *           or 'id' for user IDs. (Optional, default behaviour is automatic recognition)
 * limit' -> Amount of results. Range between 1 and 100. (Optional, defaults to 50)
 *
 * More info: https://github.com/ppy/osu-api/wiki#apiget_scores
 */ export default async function (
	req: FastifyRequest,
	reply: FastifyReply
): Promise<FastifyReply> {
	const beatmapID = req.query["b"];
	const userToSearch = req.query["u"] as string;
	let gamemode = req.query["m"] as string | number;
	let mods = req.query["mods"] as string | number;
	const type = req.query["type"];
	let limit = req.query["limit"] as string | number;

	if (!beatmapID) return reply.send([]);

	if (gamemode < 0 || gamemode > 3 || !Misc.isNumeric(gamemode)) gamemode = 0;
	if (!Misc.isNumeric(mods)) mods = 0;
	if (limit < 1 || limit > 100 || !limit) limit = 10;

	const beatmap = await BpyDb.getBeatmapByID(Number(beatmapID));

	if (!beatmap) return reply.send([]);

	let scores;
	if (userToSearch) {
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

		scores = await BpyDb.getBeatmapScores(
			beatmap.md5,
			Number(mods),
			Number(gamemode),
			user.id
		);
	} else {
		scores = await BpyDb.getBeatmapScores(
			beatmap.md5,
			Number(mods),
			Number(gamemode)
		);
	}

	const output: BeatmapScoreBancho[] = [];
	for (const score of scores) {
		output.push({
			score_id: `${beatmapID}`,
			score: `${score.score}`,
			username: `${score.name}`,
			maxcombo: `${score.max_combo}`,
			count50: `${score.n50}`,
			count100: `${score.n100}`,
			count300: `${score.n300}`,
			countmiss: `${score.nmiss}`,
			countkatu: `${score.nkatu}`,
			countgeki: `${score.ngeki}`,
			perfect: `${score.perfect}`,
			enabled_mods: `${score.mods}`,
			user_id: `${score.userid}`,
			date: `${moment(score.play_time)
				.utc()
				.format("YYYY-MM-DD HH:MM:SS")}`,
			rank: `${score.grade}`,
			pp: `${score.pp}`,
			replay_available: `${score.online_checksum ? 1 : 0}`,
		});
	}
	return reply.send(output);
}

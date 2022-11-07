import { FastifyRequest, FastifyReply } from "fastify";
import moment from "moment";
import { UserBpyDb } from "../../common/types";
import { BpyApi } from "../../util/bpy-api";
import { BpyDb } from "../../util/bpy-db";
import { Misc } from "../../util/misc";

/**
 * Query parameters:
 * 'k' -> API Key (Required)
 * 'u' -> User ID or username (Required)
 * 'm' -> Gamemode integer. 0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania. (Optional, default value is 0)
 * 'type' -> Specify if the query parameter 'u' is a User ID or a username. Use 'string' for usernames
 *           or 'id' for user IDs. (Optional, default behaviour is automatic recognition)
 * 'event_days' -> Max number of days between now and last event date. Range of 1-31. (Optional, default value is 1)
 *
 * More info: https://github.com/ppy/osu-api/wiki#apiget_user
 */
export default async function (
	req: FastifyRequest,
	reply: FastifyReply
): Promise<FastifyReply> {
	const userToSearch = req.query["u"] as string;
	let gamemode = req.query["m"] as string | number;
	const type = req.query["type"];
	// const event_days = Number(req.query["event_days"]); TODO: To be implemented

	if (gamemode < 0 || gamemode > 3 || !Misc.isNumeric(gamemode)) gamemode = 0;

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

	const userStats = await BpyApi.getUserInfoByID(user.id);

	return reply.send([
		{
			user_id: `${user.id}`,
			username: `${user.name}`,
			join_date: `${moment
				.unix(user.creation_time)
				.utc()
				.format("YYYY-MM-DD HH:MM:SS")}`,
			count300: `0`,
			count100: `0`,
			count50: `0`,
			playcount: `${userStats.player.stats[gamemode].plays}`,
			ranked_score: `${userStats.player.stats[gamemode].rscore}`,
			total_score: `${userStats.player.stats[gamemode].tscore}`,
			pp_rank: `${userStats.player.stats[gamemode].rank}`,
			level: `727`, // TODO: To be implemented
			pp_raw: `${userStats.player.stats[gamemode].pp}`,
			accuracy: `${userStats.player.stats[gamemode].acc}`,
			count_rank_ss: `${userStats.player.stats[gamemode].x_count}`,
			count_rank_ssh: `${userStats.player.stats[gamemode].xh_count}`,
			count_rank_s: `${userStats.player.stats[gamemode].s_count}`,
			count_rank_sh: `${userStats.player.stats[gamemode].sh_count}`,
			count_rank_a: `${userStats.player.stats[gamemode].a_count}`,
			country: `${user.country.toUpperCase()}`,
			total_seconds_played: `${userStats.player.stats[gamemode].playtime}`,
			pp_country_rank: `${userStats.player.stats[gamemode].country_rank}`,
			events: [], // TODO: To be implemented
		},
	]);
}

import { FastifyRequest, FastifyReply } from "fastify";
import moment from "moment";
import { App } from "../../app";
import { UserBpyDb } from "../../common/types";
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

	const userStats = await BpyDb.getStatsByID(user.id);
	for (const key in userStats) {
		const rank = await App.instance.redis.ZREVRANK(
			`bancho:leaderboard:${key}`,
			`${user.id}`
		);
		userStats[key].rank = Misc.isNumeric(rank) ? rank + 1 : 0;

		const countryRank = await App.instance.redis.ZREVRANK(
			`bancho:leaderboard:${key}:${user.country}`,
			`${user.id}`
		);
		userStats[key].country_rank = Misc.isNumeric(countryRank) ? countryRank + 1 : 0;
	}

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
			playcount: `${userStats[gamemode].plays}`,
			ranked_score: `${userStats[gamemode].rscore}`,
			total_score: `${userStats[gamemode].tscore}`,
			pp_rank: `${userStats[gamemode].rank}`,
			level: `727`, // TODO: To be implemented
			pp_raw: `${userStats[gamemode].pp}`,
			accuracy: `${userStats[gamemode].acc}`,
			count_rank_ss: `${userStats[gamemode].x_count}`,
			count_rank_ssh: `${userStats[gamemode].xh_count}`,
			count_rank_s: `${userStats[gamemode].s_count}`,
			count_rank_sh: `${userStats[gamemode].sh_count}`,
			count_rank_a: `${userStats[gamemode].a_count}`,
			country: `${user.country.toUpperCase()}`,
			total_seconds_played: `${userStats[gamemode].playtime}`,
			pp_country_rank: `${userStats[gamemode].country_rank}`,
			events: [], // TODO: To be implemented
		},
	]);
}

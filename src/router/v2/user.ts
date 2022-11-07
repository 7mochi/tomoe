import { FastifyRequest, FastifyReply } from "fastify";
import moment from "moment";
import { App } from "../../app";
import {
	GamemodeIntBanchoV2,
	UserBpyDb,
} from "../../common/types";
import { BpyApi } from "../../util/bpy-api";
import { BpyDb } from "../../util/bpy-db";
import { Misc } from "../../util/misc";
import countries from "i18n-iso-countries";
import errors from "../../util/errors";

/**
 * URL parameters:
 * 'user' -> User ID or username
 * 'mode?' -> Gamemode integer. 0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania. (Optional, default value is 0)
 *
 * Query parameters:
 * 'key?' -> Type of 'user' passed in url parameter. Can be either id or username to limit lookup by their
 *           respective type. Passing empty or invalid value will result in id lookup followed by username
 *           lookup if not found
 *
 * More info: https://osu.ppy.sh/zdocs/index.html#get-user
 */
export default async function (
	req: FastifyRequest,
	reply: FastifyReply
): Promise<FastifyReply> {
	const userToSearch = req.params["user"] as string;
	let gamemode = req.params["mode"] as string;
	const key = req.query["key"] as string;

	if (!["osu", "taiko", "fruits", "mania"].includes(gamemode))
		gamemode = "osu";

	let user: UserBpyDb;
	if (key) {
		switch (key) {
			case "id": {
				user = await BpyDb.getUserByID(Number(userToSearch));
				break;
			}
			case "username": {
				user = await BpyDb.getUserByUsername(userToSearch);
				break;
			}
			default: {
				user = await BpyDb.getUserByID(Number(userToSearch));
				if (!user) {
					user = await BpyDb.getUserByUsername(userToSearch);
				}
			}
		}
	} else {
		user = await BpyDb.getUserByID(Number(userToSearch));
		if (!user) {
			user = await BpyDb.getUserByUsername(userToSearch);
		}
	}

	if (!user) return reply.send({ error: errors.USER_NOT_FOUND });

	const userStats = await BpyApi.getUserInfoByID(user.id);

	const bpyUrl = await App.instance.config.bpyAvatarUrl;
	const coverUrl = `https://osu.ppy.sh/images/headers/profile-covers/c${Misc.randomIntFromInterval(
		1,
		8
	)}.jpg`;

	return reply.send({
		avatar_url: `${bpyUrl}/${user.id}`,
		country_code: user.country.toUpperCase(),
		default_group: "default",
		id: user.id,
		is_active: true,
		is_bot: false, // TODO: To be implemented
		is_deleted: false,
		is_online: user.online,
		is_supporter: false, // TODO: To be implemented
		last_visit: moment(user.latest_activity, "X").format(),
		pm_friends_only: false, // TODO: To be implemented
		profile_colour: "",
		username: user.name,
		cover_url: coverUrl,
		discord: "",
		has_supported: true, // TODO: To be implemented
		interests: "",
		join_date: moment(user.creation_time, "X").format(),
		kudosu: {
			available: 420,
			total: 727,
		},
		location: "",
		max_blocks: 50,
		max_friends: 250,
		occupation: "",
		playmode: "osu",
		playstyle: [],
		post_count: 0,
		profile_order: [
			"me",
			"recent_activity",
			"top_ranks",
			"medals",
			"historical",
			"beatmaps",
			"kudosu",
		],
		title: "",
		title_url: "",
		twitter: "",
		website: "",
		country: {
			code: user.country.toUpperCase(),
			name: countries.getName(user.country, "en"),
		},
		cover: {
			custom_url: coverUrl,
			url: coverUrl,
			id: "",
		},
		account_history: [],
		badges: [],
		beatmap_playcounts_count: 0,
		comments_count: 0,
		favourite_beatmapset_count: 0,
		follower_count: 0,
		graveyard_beatmapset_count: 0,
		groups: [], // TODO: To be implemented
		guest_beatmapset_count: 0,
		loved_beatmapset_count: 0,
		mapping_follower_count: 0,
		pending_beatmapset_count: 0,
		previous_usernames: [],
		ranked_beatmapset_count: 0,
		scores_best_count: 0, // TODO: To be implemented
		scores_first_count: 0, // TODO: To be implemented
		scores_recent_count: 0, // TODO: To be implemented
		statistics: {
			level: {
				// TODO: To be implemented
				current: 727,
				progress: 69,
			},
			global_rank:
				userStats.player.stats[GamemodeIntBanchoV2[gamemode]].rank,
			pp: userStats.player.stats[GamemodeIntBanchoV2[gamemode]].pp,
			ranked_score:
				userStats.player.stats[GamemodeIntBanchoV2[gamemode]].rscore,
			hit_accuracy:
				userStats.player.stats[GamemodeIntBanchoV2[gamemode]].acc,
			play_count:
				userStats.player.stats[GamemodeIntBanchoV2[gamemode]].plays,
			play_time:
				userStats.player.stats[GamemodeIntBanchoV2[gamemode]].playtime,
			total_score:
				userStats.player.stats[GamemodeIntBanchoV2[gamemode]].tscore,
			total_hits: 0, // TODO: To be implemented
			maximum_combo:
				userStats.player.stats[GamemodeIntBanchoV2[gamemode]].max_combo,
			replays_watched_by_others: 0,
			is_ranked: true,
			grade_counts: {
				ss: userStats.player.stats[GamemodeIntBanchoV2[gamemode]]
					.x_count,
				ssh: userStats.player.stats[GamemodeIntBanchoV2[gamemode]]
					.xh_count,
				s: userStats.player.stats[GamemodeIntBanchoV2[gamemode]]
					.s_count,
				sh: userStats.player.stats[GamemodeIntBanchoV2[gamemode]]
					.sh_count,
				a: userStats.player.stats[GamemodeIntBanchoV2[gamemode]]
					.a_count,
			},
			country_rank:
				userStats.player.stats[GamemodeIntBanchoV2[gamemode]]
					.pp_country_rank,
			rank: {
				country:
					userStats.player.stats[GamemodeIntBanchoV2[gamemode]]
						.pp_country_rank,
			},
		},
		support_level: 0,
		ranked_and_approved_beatmapset_count: 0,
		unranked_beatmapset_count: 0,
		is_restricted: false, // TODO: To be implemented
	});
}

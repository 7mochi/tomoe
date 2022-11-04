import moment from "moment";
import PromiseRouter from "express-promise-router";
import { Request, Response } from "express";
import { BpyDb } from "../../util/bpy-db";
import { Misc } from "../../util/misc";
import { BpyApi } from "../../util/bpy-api";
import {
	UserBpyDb,
	UserBancho,
	UserBestBancho,
	BeatmapScoreBancho,
	UserRecentBancho,
	LZMAReplayBancho,
} from "../../common/types";
import { withApiKey } from "../../middlewares";

export class ApiV1Router {
	public readonly router = PromiseRouter();

	constructor() {
		this.router.get("/get_replay", withApiKey, this.getReplay);
		this.router.get("/get_scores", withApiKey, this.getScores);
		this.router.get("/get_user", withApiKey, this.getUser);
		this.router.get("/get_user_best", withApiKey, this.getUserBest);
		this.router.get("/get_user_recent", withApiKey, this.getUserRecent);
	}

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
	 */
	async getScores(req: Request, res: Response): Promise<void> {
		const beatmapID = req.query.b;
		const userToSearch = req.query.u as string;
		let gamemode = req.query.m as string | number;
		let mods = req.query.mods as string | number;
		const type = req.query.type;
		let limit = req.query.limit as string | number;

		if (beatmapID) {
			if (!Misc.isNumeric(gamemode)) {
				gamemode = 0;
			}

			if (!Misc.isNumeric(mods)) {
				mods = 0;
			}

			if (!limit || limit < 1 || limit > 100) {
				limit = 10;
			}

			const beatmap = await BpyDb.getBeatmapByID(Number(beatmapID));

			if (beatmap) {
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

				let temp: BeatmapScoreBancho;
				const output: BeatmapScoreBancho[] = [];
				for (const score of scores) {
					temp = {
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
					};
					output.push(temp);
				}
				res.json(output);
			} else {
				res.json([]);
			}
		} else {
			res.json([]);
		}
	}

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
	async getUser(req: Request, res: Response): Promise<void> {
		const userToSearch = req.query.u as string;
		let gamemode = req.query.m as string | number;
		const type = req.query.type;
		// const event_days = Number(req.query.event_days); TODO: To be implemented

		if (!Misc.isNumeric(gamemode)) {
			gamemode = 0;
		}

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

		if (user) {
			const userStats = await BpyApi.getUserInfoByID(user.id);
			const output: UserBancho = {
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
			};
			res.json([output]);
		} else {
			res.json([]);
		}
	}

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
	async getUserBest(req: Request, res: Response): Promise<void> {
		const userToSearch = req.query.u as string;
		let gamemode = req.query.m as string | number;
		let limit = req.query.limit as string | number;
		const type = req.query.type;

		if (!Misc.isNumeric(gamemode)) {
			gamemode = 0;
		}

		if (!limit || limit < 1 || limit > 100) {
			limit = 10;
		}

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

		if (user) {
			const topPlays = await BpyDb.getUserTopPlays(
				user.id,
				Number(gamemode),
				Number(limit)
			);

			let temp: UserBestBancho;
			const output: UserBestBancho[] = [];
			for (const play of topPlays) {
				temp = {
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
				};
				output.push(temp);
			}
			res.json(output);
		} else {
			res.json([]);
		}
	}

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
	async getUserRecent(req: Request, res: Response): Promise<void> {
		const userToSearch = req.query.u as string;
		let gamemode = req.query.m as string | number;
		let limit = req.query.limit as string | number;
		const type = req.query.type;

		if (!Misc.isNumeric(gamemode)) {
			gamemode = 0;
		}

		if (!limit || limit < 1 || limit > 100) {
			limit = 10;
		}

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

		if (user) {
			const scores = await BpyApi.getUserScoresByID(
				user.id,
				"recent",
				Number(gamemode),
				Number(limit)
			);

			let temp: UserRecentBancho;
			const output: UserRecentBancho[] = [];
			for (const score of scores.scores) {
				temp = {
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
				};
				output.push(temp);
			}
			res.json(output);
		} else {
			res.json([]);
		}
	}

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
	async getReplay(req: Request, res: Response): Promise<void> {
		const beatmapID = req.query.b;
		const userToSearch = req.query.u as string;
		let gamemode = req.query.m as string | number;
		const scoreID = req.query.s;
		let mods = req.query.mods as string | number;
		const type = req.query.type;

		if (beatmapID) {
			if (scoreID) {
				res.json([]); // TODO: To be implemented
			} else {
				if (!Misc.isNumeric(gamemode)) {
					gamemode = 0;
				}

				if (!Misc.isNumeric(mods)) {
					mods = 0;
				}

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

				const output: LZMAReplayBancho = {
					content: await BpyApi.getLZMAReplayByID(scores[0].id),
					encoding: "base64",
				};
				res.json(output);
			}
		} else {
			res.json([]);
		}
	}
}

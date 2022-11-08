import { App } from "../app";
import {
	BeatmapInfoDb,
	BeatmapScoreDb,
	UserBpyDb,
	UserStatsDb,
	UserTopPlaysDb,
} from "../common/types";

export class BpyDb {
	static async getUserByID(id: number): Promise<UserBpyDb> {
		const data = (await App.instance.database.query(
			"SELECT * FROM users WHERE id = ?",
			id
		)) as UserBpyDb;
		return data[0];
	}

	static async getUserByUsername(username: string): Promise<UserBpyDb> {
		const data = (await App.instance.database.query(
			"SELECT * FROM users WHERE name = ? OR safe_name = ?",
			[username, username]
		)) as UserBpyDb;
		return data[0];
	}

	static async getStatsByID(id: number): Promise<UserStatsDb[]> {
		return (await App.instance.database.query(
			"SELECT mode, tscore, rscore, pp, plays, playtime, acc," +
				"max_combo, xh_count, x_count, sh_count, s_count, a_count " +
				"FROM stats WHERE id = ?",
			[id]
		)) as UserStatsDb[];
	}

	static async getUserTopPlays(
		id: number,
		gamemode: number,
		limit: number
	): Promise<UserTopPlaysDb[]> {
		return (await App.instance.database.query(
			"SELECT s.*, m.id AS beatmap_id FROM scores s INNER JOIN maps m ON s.map_md5 = m.md5 " +
				"WHERE s.userid = ? AND s.status = 2 AND m.status IN (2,3) AND s.mode = ? " +
				"ORDER BY pp DESC, s.score DESC LIMIT ?",
			[id, gamemode, limit]
		)) as UserTopPlaysDb[];
	}

	static async getBeatmapByID(id: number): Promise<BeatmapInfoDb> {
		const data = (await App.instance.database.query(
			"SELECT md5, id, set_id FROM maps WHERE id = ?",
			id
		)) as BeatmapInfoDb;
		return data[0];
	}

	static async getBeatmapScores(
		beatmapMD5: string,
		mods: number,
		gamemode: number,
		userID?: number
	): Promise<BeatmapScoreDb> {
		return (await App.instance.database.query(
			`SELECT u.name, s.* FROM scores s INNER JOIN users u ON s.userid = u.id WHERE s.map_md5 = ? ${
				userID == -1 && !isNaN(userID) ? "AND s.userid = " + userID : ""
			} ${
				mods != -1 && !isNaN(mods) ? "AND s.mods = " + mods : ""
			} AND s.status = 2 AND s.mode = ?`,
			[beatmapMD5, gamemode]
		)) as BeatmapScoreDb;
	}

	static async isApiKeyValid(apiKey = ""): Promise<boolean> {
		const data = await App.instance.database.query(
			"SELECT name, api_key FROM users WHERE api_key = ?",
			apiKey
		);

		if (data != undefined && data[0] != null) {
			return true;
		}

		return false;
	}
}

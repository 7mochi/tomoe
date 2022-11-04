import { Replay } from "@minhducsun2002/node-osr-parser";
import axios from "axios";
import rateLimit from "axios-rate-limit";
import https from "https";
import lzma from "lzma-native";
import { App } from "../app";
import { UserInfoBpyApi, UserScoresInfoBpyApi } from "../common/types";

export class BpyApi {
	private static axiosRatedLimited = rateLimit(axios.create(), {
		maxRPS: 5,
	});

	private static async request(endpoint: string): Promise<unknown> {
		const httpsAgent = new https.Agent({
			rejectUnauthorized: false, // TODO: Not recommended
		});

		const response = await this.axiosRatedLimited(endpoint, {
			baseURL: await App.instance.config.bpyApiUrl,
			httpsAgent: httpsAgent,
		});

		return response.data;
	}

	private static async downloadFileAsBase64(
		endpoint: string
	): Promise<string> {
		const httpsAgent = new https.Agent({
			rejectUnauthorized: false, // TODO: Not recommended
		});

		const response = await this.axiosRatedLimited(endpoint, {
			baseURL: await App.instance.config.bpyApiUrl,
			httpsAgent: httpsAgent,
			responseType: "arraybuffer",
			headers: {
				Accept: "application/octet-stream",
			},
		});

		const buffer = Buffer.from(response.data, "binary");
		const replay = await new Replay(buffer).deserialize();
		const compressedData = (await lzma.compress(
			replay.replayData
		)) as unknown as Buffer;

		return compressedData.toString("base64");
	}

	static async getUserInfoByID(id: number): Promise<UserInfoBpyApi> {
		return (await this.request(
			`/get_player_info?id=${id}&scope=stats`
		)) as UserInfoBpyApi;
	}

	static async getUserScoresByID(
		id: number,
		scope: string,
		mode: number,
		limit: number
	): Promise<UserScoresInfoBpyApi> {
		return (await this.request(
			`/get_player_scores?id=${id}&scope=${scope}&mode=${mode}&limit=${limit}`
		)) as UserScoresInfoBpyApi;
	}

	static async getLZMAReplayByID(id: number): Promise<string> {
		return await this.downloadFileAsBase64(`/get_replay?id=${id}`);
	}
}

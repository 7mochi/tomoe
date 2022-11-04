/** Bancho.py DB */
export interface UserBpyDb {
	id: number;
	name: string;
	safe_name: string;
	email: string;
	priv: number;
	pw_bcrypt: string;
	country: string;
	silence_end: number;
	donor_end: number;
	creation_time: number;
	latest_activity: number;
	clan_id: number;
	clan_priv: number;
	preferred_mode: number;
	play_style: number;
	custom_badge_name: string;
	custom_badge_icon: string;
	userpage_content: string;
	api_key: string;
	online?: boolean;
}

export interface UserTopPlaysDb {
	beatmap_id: number;
	id: number;
	map_md5: string;
	score: number;
	pp: number;
	acc: number;
	max_combo: number;
	mods: number;
	n300: number;
	n100: number;
	n50: number;
	nmiss: number;
	ngeki: number;
	nkatu: number;
	grade: string;
	status: number;
	mode: number;
	play_time: string;
	time_elapsed: number;
	client_flags: number;
	userid: number;
	perfect: number;
	online_checksum: string;
}

export interface BeatmapScoreDb {
	name: string;
	id: number;
	map_md5: string;
	score: number;
	pp: number;
	acc: number;
	max_combo: number;
	mods: number;
	n300: number;
	n100: number;
	n50: number;
	nmiss: number;
	ngeki: number;
	nkatu: number;
	grade: string;
	status: number;
	mode: number;
	play_time: string;
	time_elapsed: number;
	client_flags: number;
	userid: number;
	perfect: number;
	online_checksum: string;
}

export interface BeatmapInfoDb {
	md5: string;
	id: number;
	set_id: number;
}

/** Bancho.py API */
export interface UserInfoBpyApi {
	status: string;
	player: UserStatsInfoBpyApi;
}

export interface UserStatsInfoBpyApi {
	stats: StatsBpyApi;
}

export interface StatsBpyApi {
	0: StatsGamemodeBpyApi;
	1: StatsGamemodeBpyApi;
	2: StatsGamemodeBpyApi;
	3: StatsGamemodeBpyApi;
	4: StatsGamemodeBpyApi;
	5: StatsGamemodeBpyApi;
	6: StatsGamemodeBpyApi;
	8: StatsGamemodeBpyApi;
}

export interface StatsGamemodeBpyApi {
	tscore: number;
	rscore: number;
	pp: number;
	plays: number;
	playtime: number;
	acc: number;
	max_combo: number;
	xh_count: number;
	x_count: number;
	sh_count: number;
	s_count: number;
	a_count: number;
	rank: number;
	country_rank: number;
}

export interface UserScoresInfoBpyApi {
	status: string;
	scores: UserScoresBpyApi[];
	player: UserInfoBpy;
}

export interface UserScoresBpyApi {
	id: number;
	score: number;
	pp: number;
	acc: number;
	max_combo: number;
	mods: number;
	n300: number;
	n100: number;
	n50: number;
	nmiss: number;
	ngeki: number;
	nkatu: number;
	grade: string;
	status: number;
	mode: number;
	play_time: string;
	time_elapsed: number;
	perfect: number;
	beatmap: BeatmapInfoBpy;
}

export interface BeatmapInfoBpy {
	md5: string;
	id: number;
	set_id: number;
	artist: string;
	title: string;
	version: string;
	creator: string;
	last_update: string;
	total_length: number;
	max_combo: number;
	status: number;
	plays: number;
	passes: number;
	mode: number;
	bpm: number;
	cs: number;
	od: number;
	ar: number;
	hp: number;
	diff: number;
}

export interface UserInfoBpy {
	id: number;
	name: string;
	clan: UserClanInfoBpy;
}

export interface UserClanInfoBpy {
	id: number;
	name: string;
	tag: string;
}

/** Tomoe API */
export interface UserBancho {
	user_id: string;
	username: string;
	join_date: string;
	count300: string;
	count100: string;
	count50: string;
	playcount: string;
	ranked_score: string;
	total_score: string;
	pp_rank: string;
	level: string;
	pp_raw: string;
	accuracy: string;
	count_rank_ss: string;
	count_rank_ssh: string;
	count_rank_s: string;
	count_rank_sh: string;
	count_rank_a: string;
	country: string;
	total_seconds_played: string;
	pp_country_rank: string;
	events: EventsBancho[];
}

export interface EventsBancho {
	display_html: string;
	beatmap_id: string;
	beatmapset_id: string;
	date: string;
	epicfactor: string;
}

export interface UserBestBancho {
	beatmap_id: string;
	score_id: string;
	score: string;
	maxcombo: string;
	count50: string;
	count100: string;
	count300: string;
	countmiss: string;
	countkatu: string;
	countgeki: string;
	perfect: string;
	enabled_mods: string;
	user_id: string;
	date: string;
	rank: string;
	pp: string;
	replay_available: string;
}

export interface BeatmapScoreBancho {
	score_id: string;
	score: string;
	username: string;
	count300: string;
	count100: string;
	count50: string;
	countmiss: string;
	maxcombo: string;
	countkatu: string;
	countgeki: string;
	perfect: string;
	enabled_mods: string;
	user_id: string;
	date: string;
	rank: string;
	pp: string;
	replay_available: string;
}

export interface UserRecentBancho {
	beatmap_id: string;
	score: string;
	maxcombo: string;
	count50: string;
	count100: string;
	count300: string;
	countmiss: string;
	countkatu: string;
	countgeki: string;
	perfect: string;
	enabled_mods: string;
	user_id: string;
	date: string;
	rank: string;
}

export interface LZMAReplayBancho {
	content: string;
	encoding: string;
}

export interface ErrorApiBancho {
	error: string;
}

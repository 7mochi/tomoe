/* -------------------------------------------------------------------------- */
/*                                Bancho.py DB                                */
/* -------------------------------------------------------------------------- */
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

export interface UserStatsDb {
	mode: number;
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
	rank?: number;
	country_rank?: number;
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

/* -------------------------------------------------------------------------- */
/*                                Bancho.py API                               */
/* -------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */
/*                                Tomoe API V1                                */
/* -------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */
/*                                Tomoe API V2                                */
/* -------------------------------------------------------------------------- */
export interface UserBanchoV2 extends UserCompactBaseBanchoV2 {
	discord?: string;
	has_supported: boolean;
	interests?: string;
	join_date: string;
	kudosu: UserCompactKudosuBanchoV2;
	location?: string;
	max_blocks?: number;
	max_friends: number;
	occupation?: string;
	playmode: string;
	playstyle: string[];
	post_count: number;
	profile_order: string[];
	title?: string;
	title_url?: string;
	twitter?: string;
	website?: string;
	cover: UserCompactCoverBanchoV2;
	country: UserCompactCountryBanchoV2;
	is_restricted: boolean;
}

export interface UserCompactBanchoV2 extends UserCompactBaseBanchoV2 {
	country?: UserCompactCountryBanchoV2;
	cover?: UserCompactCoverBanchoV2;
	is_restricted?: boolean;
}

export interface UserCompactBaseBanchoV2 {
	avatar_url: string;
	cover_url?: string;
	country_code: string;
	default_group: string;
	id: number;
	is_active: boolean;
	is_bot: boolean;
	is_deleted: boolean;
	is_online: boolean;
	is_supporter: boolean;
	last_visit?: string;
	pm_friends_only: boolean;
	profile_colour: string;
	username: string;
	account_history?: UserAccountHistoryBanchoV2[];
	active_tournament_banner?: UserCompactProfileBannerBanchoV2;
	badges?: UserBadgeBanchoV2[];
	beatmap_playcounts_count?: number;
	blocks?: unknown;
	favourite_beatmapset_count?: number;
	follower_count?: number;
	friends?: unknown;
	groups?: UserGroupBanchoV2[];
	monthly_playcounts?: UserMonthlyPlaycountBanchoV2[];
	page?: unknown;
	previous_usernames?: string[];
	rank_history?: {
		data?: number[];
	};
	replays_watched_counts?: number;
	scores_best_count?: number;
	scores_first_count?: number;
	scores_recent_count?: number;
	statistics?: UserCompactStatisticsBanchoV2;
	statistics_rulesets?: UserStatisticsRulesetsBanchoV2;
	support_level?: unknown;
	unread_pm_count?: unknown;
	user_achievements?: UserAchievementBanchoV2[];
	user_preferences?: unknown;
	ranked_and_approved_beatmapset_count?: number;
	guest_beatmapset_count: number;
	graveyard_beatmapset_count?: number;
	unranked_beatmapset_count?: number;
	ranked_beatmapset_count?: number;
	loved_beatmapset_count?: number;
	pending_beatmapset_count?: number;
	mapping_follower_count: number;
	comments_count: number;
}

export interface UserAccountHistoryBanchoV2 {
	todo?: boolean;
}

export interface UserCompactProfileBannerBanchoV2 {
	todo?: boolean;
}

export interface UserBadgeBanchoV2 {
	todo?: boolean;
}

export interface UserGroupBanchoV2 {
	colour: string;
	has_listing: boolean;
	has_playmodes: boolean;
	id: number;
	identifier: string;
	is_probationary: boolean;
	name: string;
	short_name: string;
}

export interface UserMonthlyPlaycountBanchoV2 {
	todo?: boolean;
}

export interface UserCompactKudosuBanchoV2 {
	available: number;
	total: number;
}

export interface UserCompactCoverBanchoV2 {
	custom_url?: string;
	url: string;
	id: string;
}

export interface UserCompactCountryBanchoV2 {
	code: string;
	name: string;
}

export interface UserCompactStatisticsBanchoV2 {
	level: UserCompactStatsLevelBanchoV2;
	global_rank: number;
	pp: number;
	ranked_score: number;
	hit_accuracy: number;
	play_count: number;
	play_time: number;
	total_score: number;
	total_hits: number;
	maximum_combo: number;
	replays_watched_by_others: number;
	is_ranked: true;
	grade_counts: UserCompactStatsGradeCountsBanchoV2;
	country_rank: number;
	rank: UserCompactStatsRankBanchoV2;
}

export interface UserStatisticsRulesetsBanchoV2 {
	todo?: boolean;
}

export interface UserAchievementBanchoV2 {
	achieved_at: string;
	achievement_id: number;
}

export interface UserCompactStatsLevelBanchoV2 {
	current: number;
	progress: number;
}

export interface UserCompactStatsGradeCountsBanchoV2 {
	ss: number;
	ssh: number;
	s: number;
	sh: number;
	a: number;
}

export interface UserCompactStatsRankBanchoV2 {
	country: number;
}

export const GamemodeIntBanchoV2: Dictionary = {
	osu: 0,
	taiko: 1,
	fruits: 2,
	catch: 3,
};

/* -------------------------------------------------------------------------- */
/*                                    Other                                   */
/* -------------------------------------------------------------------------- */
export interface Dictionary {
	[index: string]: number;
}

export interface LevelInfo {
	level: number;
	progress: number;
}
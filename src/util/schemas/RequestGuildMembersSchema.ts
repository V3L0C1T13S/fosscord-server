import { Tuple } from "lambert-server";

export const RequestGuildMembersSchema = {
	guild_id: new Tuple([String], String),
	// According to documentation, bots can also send a string to find a single user
	$user_ids: new Tuple([String], String),
	$query: String,
	$limit: Number,
	$presences: Boolean,
	$nonce: String,
};

export interface RequestGuildMembersSchema {
	guild_id: string[] | string;
	user_ids?: string[] | string;
	query?: string;
	limit?: number;
	presences?: boolean;
	nonce?: string | undefined;
}

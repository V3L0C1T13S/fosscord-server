/*
	Fosscord: A FOSS re-implementation and extension of the Discord.com backend.
	Copyright (C) 2023 Fosscord and Fosscord Contributors
	
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published
	by the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	
	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { join } from "path";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import protobuf from "protobufjs";
import { BaseClassWithoutId } from "./BaseClass";
import { User } from "./User";

const protoDir = join(__dirname, "../../../assets");
const preloadedSettingsProto = join(protoDir, "PreloadedUserSettings.proto");

@Entity("user_settings")
export class UserSettings extends BaseClassWithoutId {
	@PrimaryGeneratedColumn()
	index: string;

	@Column({ nullable: true })
	afk_timeout: number = 3600;

	@Column({ nullable: true })
	allow_accessibility_detection: boolean = true;

	@Column({ nullable: true })
	animate_emoji: boolean = true;

	@Column({ nullable: true })
	animate_stickers: number = 0;

	@Column({ nullable: true })
	contact_sync_enabled: boolean = false;

	@Column({ nullable: true })
	convert_emoticons: boolean = false;

	@Column({ nullable: true, type: "simple-json" })
	custom_status: CustomStatus | null = null;

	@Column({ nullable: true })
	default_guilds_restricted: boolean = false;

	@Column({ nullable: true })
	detect_platform_accounts: boolean = false;

	@Column({ nullable: true })
	developer_mode: boolean = true;

	@Column({ nullable: true })
	disable_games_tab: boolean = true;

	@Column({ nullable: true })
	enable_tts_command: boolean = false;

	@Column({ nullable: true })
	explicit_content_filter: number = 0;

	@Column({ nullable: true, type: "simple-json" })
	friend_source_flags: FriendSourceFlags = { all: true };

	@Column({ nullable: true })
	gateway_connected: boolean = false;

	@Column({ nullable: true })
	gif_auto_play: boolean = false;

	@Column({ nullable: true, type: "simple-json" })
	guild_folders: GuildFolder[] = []; // every top guild is displayed as a "folder"

	@Column({ nullable: true, type: "simple-json" })
	guild_positions: string[] = []; // guild ids ordered by position

	@Column({ nullable: true })
	inline_attachment_media: boolean = true;

	@Column({ nullable: true })
	inline_embed_media: boolean = true;

	@Column({ nullable: true })
	locale: string = "en-US"; // en_US

	@Column({ nullable: true })
	message_display_compact: boolean = false;

	@Column({ nullable: true })
	native_phone_integration_enabled: boolean = true;

	@Column({ nullable: true })
	render_embeds: boolean = true;

	@Column({ nullable: true })
	render_reactions: boolean = true;

	@Column({ nullable: true, type: "simple-json" })
	restricted_guilds: string[] = [];

	@Column({ nullable: true })
	show_current_game: boolean = true;

	@Column({ nullable: true })
	status: "online" | "offline" | "dnd" | "idle" | "invisible" = "online";

	@Column({ nullable: true })
	stream_notifications_enabled: boolean = false;

	@Column({ nullable: true })
	theme: "dark" | "light" = "dark"; // dark

	@Column({ nullable: true })
	timezone_offset: number = 0; // e.g -60

	static async toProto(settings: UserSettings) {
		const root = await protobuf.load(preloadedSettingsProto);

		const PreloadedSettings = root.lookupType("PreloadedUserSettings");

		const protoObject = {
			afkTimeout: {
				value: settings.afk_timeout,
			},
			textAndImages: {
				inlineAttachmentMedia: {
					value: settings.inline_attachment_media,
				},
				inlineEmbedMedia: {
					value: settings.inline_embed_media,
				},
				gifAutoPlay: {
					value: settings.gif_auto_play,
				},
				renderEmbeds: {
					value: settings.render_embeds,
				},
				renderReactions: {
					value: settings.render_reactions,
				},
				animateEmoji: {
					value: settings.animate_emoji,
				},
				animateStickers: {
					value: settings.animate_stickers,
				},
				enableTtsCommand: {
					value: settings.enable_tts_command,
				},
				messageDisplayCompact: {
					value: settings.message_display_compact,
				},
				explicit_content_filter: {
					value: settings.explicit_content_filter,
				},
				convertEmoticons: {
					value: settings.convert_emoticons,
				},
			},
			notifications: {
				notifyFriendsOnGoLive: {
					value: settings.stream_notifications_enabled,
				},
			},
			status: {
				status: {
					status: settings.status,
				},
			},
			localization: {
				locale: {
					localeCode: settings.locale,
					timezoneOffset: {
						offset: settings.timezone_offset,
					},
				},
			},
			appearance: {
				theme: settings.theme === "light" ? 2 : 1,
				developerMode: settings.developer_mode ?? true,
			},
			guildFolders: {
				folders:
					settings.guild_folders?.map((x) => ({
						guildIds: x.guild_ids,
						id: x.id,
						name: x.name,
					})) ?? [],
				guildPositions: settings.guild_positions,
			},
		};

		return PreloadedSettings.encode(protoObject).finish();
	}

	static async findAsProto(user_id: string) {
		const user = await User.findOneOrFail({
			where: { id: user_id },
			relations: ["settings"],
		});

		return this.toProto(user.settings);
	}
}

interface CustomStatus {
	emoji_id?: string;
	emoji_name?: string;
	expires_at?: number;
	text?: string;
}

interface GuildFolder {
	color: number;
	guild_ids: string[];
	id: number;
	name: string;
}

interface FriendSourceFlags {
	all: boolean;
}

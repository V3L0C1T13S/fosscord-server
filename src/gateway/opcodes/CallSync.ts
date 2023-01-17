import { WebSocket, Payload, Send } from "@fosscord/gateway";
import { check } from "./instanceOf";
import {
	CallSyncSchema,
	getPermission,
	OPCodes,
	VoiceState,
} from "@fosscord/util";

export async function onCallSync(this: WebSocket, data: Payload) {
	check.call(this, CallSyncSchema, data.d);

	const { channel_id } = data.d;

	const permissions = await getPermission(
		this.user_id,
		undefined,
		channel_id,
	);
	permissions.hasThrow("VIEW_CHANNEL");

	const voiceStates = await VoiceState.find({
		where: { channel_id },
	});

	if (voiceStates.length < 1) return;

	await Send(this, {
		op: OPCodes.DISPATCH,
		t: "CALL_CREATE",
		s: this.sequence++,
		d: {
			channel_id,
			message_id: "", // TODO
			region: "newark",
			ringing: [], // TODO
			voice_states: voiceStates,
		},
	});
}

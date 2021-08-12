import { JWTOptions } from "./Constants";
import jwt from "jsonwebtoken";
import { UserModel } from "../models";

export function checkToken(token: string, jwtSecret: string): Promise<any> {
	return new Promise((res, rej) => {
		token = token.replace("Bot ", ""); // TODO: proper bot support
		jwt.verify(token, jwtSecret, JWTOptions, async (err, decoded: any) => {
			if (err || !decoded) return rej("Invalid Token");

			const user = await UserModel.findOne(
				{ id: decoded.id },
				{ "user_data.valid_tokens_since": true, bot: true, disabled: true, deleted: true }
			).exec();
			if (!user) return rej("Invalid Token");
			// we need to round it to seconds as it saved as seconds in jwt iat and valid_tokens_since is stored in milliseconds
			if (decoded.iat * 1000 < user.user_data.valid_tokens_since.setSeconds(0, 0)) return rej("Invalid Token");
			if (user.disabled) return rej("User disabled");
			if (user.deleted) return rej("User not found");

			return res({ decoded, user });
		});
	});
}

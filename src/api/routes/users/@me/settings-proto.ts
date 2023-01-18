import { Router, Response, Request } from "express";
import { UserSettings } from "@fosscord/util";
import { route } from "@fosscord/api";

const router = Router();

router.get("/:id", route({}), async (req: Request, res: Response) => {
	switch (req.params.id) {
		case "1": {
			const proto = await UserSettings.findAsProto(req.user_id);

			res.send(Buffer.from(proto).toString("base64"));
			break;
		}
		default: {
			res.sendStatus(404);
		}
	}
});

router.patch("/:id", route({}), async (req: Request, res: Response) => {
	// TODO
	res.sendStatus(500);
});

export default router;

import { Request, Response } from "express";
import { CreateUserInput } from "../schema/createUserSchema";
import { createUser } from "../service/user.service";
import { UserInput } from "../utils/m-types";
import logger from "../utils/logger";

export async function createUserHandler(
	req: Request<{}, {}, CreateUserInput["body"]>,
	res: Response
) {
	try {
		const user = await createUser(req.body as UserInput);
		return res.send({ name: user.name });
	} catch (e: any) {
		logger.error(e.message);
		if (e.message == "1062") {
			return res.status(409).send({
				message: "Could not add user",
				error: "Email already exists",
			});
		}
		return res
			.status(500)
			.send({ message: "Could not add user", error: e.message });
	}
}

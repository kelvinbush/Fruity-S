import { Request, Response } from "express";
import { findOrCreateUser, updateAddress } from "../service/user.service";
import logger from "../utils/logger";

export async function getCurrentUser(req: Request, res: Response) {
	const userId = res.locals.user.uid;
	const user = await findOrCreateUser(userId);
	if (user) {
		logger.info(user);
		res.send({ user });
		return;
	} else {
		logger.info("Failed to get user");
		res.sendStatus(500);
		return;
	}
}

export async function updateUserAddress(req: Request, res: Response) {
	const userId = res.locals.user.uid;
	const user = await updateAddress(userId, req.body);
	if (user) {
		res.send({ message: "User Address updated successfully" });
		return;
	}
	res.sendStatus(500);
	return;
}

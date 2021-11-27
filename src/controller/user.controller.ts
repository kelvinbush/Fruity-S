import { Request, Response } from "express";
import { findOrCreateUser, updateAddress } from "../service/user.service";
import logger from "../utils/logger";
import { User } from "../entity/User";

export async function getCurrentUser(req: Request, res: Response) {
	const userId = res.locals.user.uid;
	const user = await findOrCreateUser(userId);
	if (user) {
		res.send({
			firstName: user.firstName,
			email: user.email,
			uid: user.username,
		});
		logger.info(user);
		return;
	}
	res.send({ message: "Failed to get User" }).sendStatus(500);
	return;
}

export async function updateUserAddress(req: Request, res: Response) {
	logger.info("Controller");
	logger.info(req.body);
	const userId = res.locals.user.uid;
	const user = await updateAddress(userId, req.body);
	if (user) {
		res.send({ message: "User Address updated successfully" }).sendStatus(
			200
		);
		return;
	}
	res.send({ message: "Failed to update User" }).sendStatus(500);
	return;
}

import { Request, Response } from "express";
import { addOrder } from "../service/order.service";
import logger from "../utils/logger";

export async function orderItems(req: Request, res: Response) {
	try {
		await addOrder(res.locals.user.uid);
		res.sendStatus(200);
	} catch (e: any) {
		logger.error(e.message);
		res.send({ message: "odering failed" }).sendStatus(500);
	}
}

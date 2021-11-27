import { Response } from "express";
import { Request } from "express";
import {
	addToCart as addToCartService,
	updateCartItem,
} from "../service/cart.service";
import logger from "../utils/logger";
export async function addingToCart(req: Request, res: Response) {
	try {
		await addToCartService(req.body);
		res.sendStatus(200);
	} catch (e: any) {
		logger.error("Couldn't add to cart controller");
		logger.error(e.message);
		res.sendStatus(500);
	}
}

export async function updateCart(req: Request, res: Response) {
	try {
		await updateCartItem(req.body);
		res.send({ message: "update successfull" }).sendStatus(200);
	} catch (e: any) {
		logger.error("Couldn't add to cart controller");
		logger.error(e.message);
		res.sendStatus(500);
	}
}

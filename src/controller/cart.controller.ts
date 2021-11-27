import { Response } from "express";
import { Request } from "express";
import {
	addToCart as addToCartService,
	deleteCartItem,
	updateCartItem,
} from "../service/cart.service";
import logger from "../utils/logger";
export async function addingToCart(req: Request, res: Response) {
	try {
		await addToCartService(req.body);
		res.sendStatus(200);
		return;
	} catch (e: any) {
		logger.error("Couldn't add to cart controller");
		logger.error(e.message);
		res.sendStatus(500);
		return;
	}
}

export async function updateCart(req: Request, res: Response) {
	try {
		await updateCartItem(req.body);
		res.send({ message: "update successfull" });
		return;
	} catch (e: any) {
		logger.error("Couldn't update cart controller");
		logger.error(e.message);
		res.sendStatus(500);
		return;
	}
}

export async function deleteFromCart(req: Request, res: Response) {
	try {
		await deleteCartItem(req.body.id);
		res.send({ message: "deletion successfull" });
		return;
	} catch (e: any) {
		logger.error("Couldn't delete from cart controller");
		logger.error(e.message);
		res.sendStatus(500);
		return;
	}
}

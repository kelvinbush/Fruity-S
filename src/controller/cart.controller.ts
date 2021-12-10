import { Response } from "express";
import { Request } from "express";
import {
	addToCart as addToCartService,
	removeItemFromCart,
	getAllCartItems,
	updateCartItem,
	allCartGetUpdated,
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

export async function removeFromCart(req: Request, res: Response) {
	try {
		// await removeItemFromCart(req.body.id);
		res.send({ message: "deletion successfull" });
		return;
	} catch (e: any) {
		logger.error("Couldn't delete from cart controller");
		logger.error(e.message);
		res.sendStatus(500);
		return;
	}
}

export async function getCartItems(req: Request, res: Response) {
	try {
		const result = await allCartGetUpdated(req.body.sessionId);
		res.send({ cartItems: result });
	} catch (e: any) {
		logger.error("Couldn't delete from cart controller");
		logger.error(e.message);
		res.sendStatus(500);
		return;
	}
}

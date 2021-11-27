import { Response } from "express";
import { Request } from "express";
import { addToCart as addToCartService } from "../service/cart.service";
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

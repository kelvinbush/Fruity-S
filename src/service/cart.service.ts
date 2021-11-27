import { ShoppingSession } from "./../entity/ShoppingSession";
import { Product } from "./../entity/Product";
import { User } from "./../entity/User";
import { CartItem } from "../entity/CartItem";
import { getRepository } from "typeorm";
import logger from "../utils/logger";
export type CartAdd = {
	username: string;
	productId: string;
	quantity: number;
};

export async function findOrCreateShoppingSession(
	username: string
): Promise<ShoppingSession> {
	try {
		const userRepo = getRepository(User);
		const user = await userRepo.findOne({
			where: { username: username },
			relations: ["shoppingSession"],
		});
		if (user.shoppingSession) {
			return user.shoppingSession;
		} else {
			const sessionRepo = getRepository(ShoppingSession);
			const newShopSesion = new ShoppingSession();
			newShopSesion.total = 1;
			return await sessionRepo.save(newShopSesion);
		}
	} catch (e: any) {
		logger.error("Couldn't find or create shopping session");
		logger.error(e.message);
		return;
	}
}

export async function findProductById(id: string): Promise<Product> {
	try {
		const prodRepo = getRepository(Product);
		const product = await prodRepo.findOne({
			where: { id: id },
		});
		return product;
	} catch (e: any) {
		logger.error("Couldn't find product");
		logger.error(e.message);
		return;
	}
}

export async function addToCart(item: CartAdd) {
	//get product
	const product = await findProductById(item.productId);
	//get session
	const session = await findOrCreateShoppingSession(item.username);
	if (product && session) {
		try {
			// create cartItem
			const cartRepo = getRepository(CartItem);
			const newCartItem = new CartItem();
			newCartItem.product = product;
			newCartItem.quantity = item.quantity;
			newCartItem.session = session;
			await cartRepo.save(newCartItem);
		} catch (e: any) {
			logger.error("Couldn't add to cart");
			logger.error(e.message);
		}
	}
}

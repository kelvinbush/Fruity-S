import { ShoppingSession } from "./../entity/ShoppingSession";
import { User } from "./../entity/User";
import { CartItem } from "../entity/CartItem";
import { getRepository, getConnection, getManager } from "typeorm";
import logger from "../utils/logger";
export type CartAdd = {
	productId: string;
	quantity: number;
};

export async function addToCart(item: CartAdd, uid: string) {
	try {
		return await getConnection()
			.createQueryBuilder()
			.insert()
			.into(CartItem)
			.values([
				{
					quantity: item.quantity,
					sessionId: await getSessionId(uid),
					productId: item.productId,
				},
			])
			.execute();
	} catch (e: any) {
		logger.error("Couldn't add to cart");
		logger.error(e);
		return;
	}
}

export async function getSessionId(uid: string) {
	const userRepo = getRepository(User);
	try {
		const user = await userRepo.findOne({ username: uid });
		const sessionId = user.shoppingSession.id;
		return sessionId;
	} catch (e) {
		logger.error(e);
	}
}

export async function getCartItemsForUser(uid: string) {
	try {
		return await getManager()
			.createQueryBuilder(CartItem, "cart")
			.leftJoinAndSelect("cart.product", "p")
			.select([
				"cart.id",
				"cart.quantity",
				"p.name",
				"p.imageUrl",
				"p.price",
			])
			.where("cart.sessionId = :sessionId", {
				sessionId: await getSessionId(uid),
			})
			.getMany();
	} catch (error) {
		logger.error("Couldn't get cart items");
		logger.error(error);
		return;
	}
}

export async function updateCartItem(cartId: string, quantity: number) {
	try {
		await getRepository(CartItem).update(
			{ id: cartId },
			{ quantity: quantity }
		);
	} catch (error: any) {
		logger.error("Couldn't update cart");
		logger.error(error.message);
	}
}

export async function removeItemFromCart(cartId: string) {
	try {
		await getRepository(CartItem).delete({ id: cartId });
	} catch (error: any) {
		logger.error("Couldn't delete item from cart");
		logger.error(error.message);
	}
}

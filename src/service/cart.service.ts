import { ShoppingSession } from "./../entity/ShoppingSession";
import { Product } from "./../entity/Product";
import { User } from "./../entity/User";
import { CartItem } from "../entity/CartItem";
import {
	getRepository,
	getConnection,
	createQueryBuilder,
	getManager,
} from "typeorm";
import logger from "../utils/logger";
import {
	getAllCartItemsQuery,
	insertItemToCartQuery,
	InsertToCartType,
} from "../utils/raw-queries";
export type CartAdd = {
	productId: string;
	quantity: number;
	sessionId: string;
};

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
	try {
		return await getConnection()
			.createQueryBuilder()
			.insert()
			.into(CartItem)
			.values([
				{
					quantity: item.quantity,
					sessionId: item.sessionId,
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

export type CartUpdate = {
	id: string;
	quantity: number;
};

export async function removeItemFromCart(id: string, username: string) {
	try {
		const user = await getRepository(User).findOne(
			{ username: username },
			{ relations: ["shoppingSession"] }
		);

		await getRepository(CartItem).delete({
			id: id,
			session: user.shoppingSession,
		});
	} catch (error: any) {
		logger.error("Couldn't delete item from cart");
		logger.error(error.message);
	}
}

export async function updateCartItem(cart: CartUpdate) {
	try {
		const cartItem = await findCartById(cart.id);
		if (cartItem) {
			await getRepository(CartItem).update(
				{ id: cartItem.id },
				{ quantity: cart.quantity }
			);
		}
	} catch (error: any) {
		logger.error("Couldn't update cart");
		logger.error(error.message);
	}
}

export async function findCartById(id: string): Promise<CartItem> {
	try {
		const cartRepo = getRepository(CartItem);
		return await cartRepo.findOne({ where: { id: id } });
	} catch (error) {
		logger.error("Couldn't update cart");
		logger.error(error.message);
		return;
	}
}

export async function carts(username: string): Promise<CartItem[]> {
	try {
		const session = await findOrCreateShoppingSession(username);
		const cartItems = await getRepository(ShoppingSession).findOne(
			{
				id: session.id,
			},
			{ relations: ["cartItems"] }
		);

		return cartItems.cartItems;
	} catch (error) {
		logger.error("Couldn't get carts");
		logger.error(error.message);
		return;
	}
}

export async function getAllCartItems(username: string): Promise<Product[]> {
	try {
		const cartItems = await carts(username);
		let products: Product[] = [];
		await Promise.all(
			cartItems.map(async (item) => products.push(await getCart(item.id)))
		);
		return products;
	} catch (error: any) {
		logger.error("Couldn't get cart items");
		logger.error(error.message);
		return;
	}
}

export async function allCartGetUpdated(sessionId: string) {
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
			.where("cart.sessionId = :sessionId", { sessionId: sessionId })
			.getMany();
	} catch (error) {
		logger.error("Couldn't get cart items");
		logger.error(error);
		return;
	}
}
export async function getCart(id: string) {
	try {
		const cart: CartItem = await getRepository(CartItem).findOne(
			{ id: id },
			{ relations: ["product"] }
		);
		return cart.product;
	} catch (error: any) {
		logger.error("Couldn't get cart items");
		logger.error(error.message);
		return;
	}
}

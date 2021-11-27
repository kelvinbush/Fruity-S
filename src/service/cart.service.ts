import { ShoppingSession } from "./../entity/ShoppingSession";
import { Product } from "./../entity/Product";
import { User } from "./../entity/User";
import { CartItem } from "../entity/CartItem";
import { getRepository, LockNotSupportedOnGivenDriverError } from "typeorm";
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
			const session = await sessionRepo.save(newShopSesion);
			await userRepo.update(
				{ username: username },
				{ shoppingSession: session }
			);
			return session;
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

export type CartUpdate = {
	id: string;
	quantity: number;
};

export async function deleteCartItem(id: string) {
	try {
		await getRepository(CartItem).delete({ id: id });
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

export async function getAllCartItems(username: string): Promise<Product[]> {
	try {
		const session = await findOrCreateShoppingSession(username);
		const cartItems = await getRepository(ShoppingSession).findOne(
			{
				id: session.id,
			},
			{ relations: ["cartItems"] }
		);
		let products: Product[] = [];
		await Promise.all(
			cartItems.cartItems.map(async (item) =>
				products.push(await getCart(item.id))
			)
		);
		return products;
	} catch (error: any) {
		logger.error("Couldn't get cart items");
		logger.error(error.message);
		return;
	}
}

async function getCart(id: string) {
	try {
		const cart = await getRepository(CartItem).findOne(
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

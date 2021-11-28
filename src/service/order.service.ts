import { User } from "./../entity/User";
import { getRepository } from "typeorm";
import { carts, getCart } from "./cart.service";
import { OrderDetails } from "../entity/OrderDetails";
import { OrderItems } from "../entity/OrderItems";
import logger from "../utils/logger";
import { ShoppingSession } from "../entity/ShoppingSession";
import { CartItem } from "../entity/CartItem";

export async function addOrder(username: string) {
	const cartItems = await carts(username);
	const order = new OrderDetails();
	try {
		const user = await getRepository(User).findOne({
			where: { username: username },
		});
		if (user) {
			order.user = user;
			const items = await Promise.all(
				cartItems.map(async (item) => {
					const product = await getCart(item.id);
					const orderItem = new OrderItems();
					orderItem.product = product;
					orderItem.quantity = item.quantity;
					orderItem.detail = order;
					return await getRepository(OrderItems).save(orderItem);
				})
			);
			order.items = items;
			await getRepository(OrderDetails).save(order);
			await deleteCart(username);
		}
	} catch (error) {
		logger.error("Failed to order service");
		logger.error(error);
	}
}

export async function deleteCart(username: string) {
	try {
		const userRepo = getRepository(User);
		const user = await userRepo.findOne({
			where: { username: username },
			relations: ["shoppingSession"],
		});

		const cart = await getRepository(ShoppingSession).findOne({
			where: { id: user.shoppingSession.id },
		});

		await getRepository(CartItem).delete({ session: cart });
		await getRepository(ShoppingSession).remove(cart);
	} catch (error) {
		logger.error("Failed to empty cart");
		logger.error(error);
	}
}

export const getAllCartItemsQuery = (
	sessionId: string
) => `select cart.id as id,
       cart.quantity as quantity,
       p.name,
       p.imageUrl,
       p.price
	from cart_item cart
         join product p on p.id = cart.productId and cart.sessionId = '${sessionId}'`;

export type InsertToCartType = {
	quantity: number;
	sessionId: string;
	productId: string;
};
export const insertItemToCartQuery = (item: InsertToCartType) =>
	`INSERT INTO cart_item(quantity, sessionId, productId) VALUES (${item.quantity}, '${item.sessionId}', '${item.productId}');`;

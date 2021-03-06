import { Express, Request, Response } from "express";
import {
	getCurrentUser,
	updateUserAddress,
} from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import {
	addNewProduct,
	getAllProducts,
	updateItem,
} from "./controller/product.controller";
import {
	addingToCart,
	removeFromCart,
	getCartItems,
	updateCart,
} from "./controller/cart.controller";
import config from "config";
import logger from "./utils/logger";


const check = config.get<string>("check");
logger.info(check);

function routes(app: Express) {
	app.get("/healthcheck", (req: Request, res: Response) =>
		res.send({ message: `We are live baby 😁😁 at ${check}` })
	);
	app.get("/api/me", requireUser, getCurrentUser);
	app.post("/api/user/address", requireUser, updateUserAddress);
	app.post("/api/product", requireUser, addNewProduct);
	app.get("/api/product", requireUser, getAllProducts);
	app.post("/api/product/update", requireUser, updateItem);
	app.post("/api/addCart", requireUser, addingToCart);
	app.post("/api/updateCart", requireUser, updateCart);
	app.post("/api/deleteCart", requireUser, removeFromCart);
	app.post("/api/getMyCart", requireUser, getCartItems);
}

export default routes;

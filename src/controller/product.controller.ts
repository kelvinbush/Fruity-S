import { Request, Response } from "express";
import logger from "../utils/logger";
import {
  addProductToDB,
  getAllProductsFromDb,
  updateProduct,
} from "../service/product.service";

export async function addNewProduct(req: Request, res: Response) {
  try {
    const product = await addProductToDB(req.body);
    if (product) res.send({ message: `${product.name} added` });
    return;
  } catch (e: any) {
    logger.error(e.message);
    res.send({ message: "could not add item" }).sendStatus(500);
    return;
  }
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    const result = await getAllProductsFromDb();
    res.send({ result });
    return;
  } catch (e: any) {
    logger.error(e.message);
    res.send({ message: "could not fetch products" }).sendStatus(500);
    return;
  }
}

export async function updateItem(req: Request, res: Response) {
  try {
    await updateProduct(req.body);
    res.sendStatus(200);
  } catch (e: any) {
    logger.error(e.message);
    res.send({ message: "update failed" }).sendStatus(500);
  }
}

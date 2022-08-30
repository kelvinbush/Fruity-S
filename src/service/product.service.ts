import { getRepository } from "typeorm";
import { ProductCategory } from "../entity/ProductCategory";
import { Product } from "../entity/Product";
import { ProductInventory } from "../entity/ProductInventory";
import logger from "../utils/logger";

type NewProduct = {
	id?: string;
	inventory?: string;
	name: string;
	imageUrl: string;
	price: number;
	description: string;
	category: string;
	quantity: number;
};

export async function addProductToDB(item: NewProduct) {
	const categoryRepository = getRepository(ProductCategory);
	const productRepo = getRepository(Product);
	const inventoryRepo = getRepository(ProductInventory);
	const newInventory = inventoryRepo.create({ quantity: item.quantity });
	try {
		await inventoryRepo.save(newInventory);
		const category = await categoryRepository.findOne({
			where: { name: item.category },
		});
		let newCategory: ProductCategory;
		if (category) {
			newCategory = category;
		} else {
			newCategory = categoryRepository.create({
				name: item.category,
			});
			await categoryRepository.save(newCategory);
		}
		const product = new Product();
		product.name = item.name;
		product.imageUrl = item.imageUrl;
		product.description = item.description;
		product.price = item.price;
		product.inventory = newInventory;
		product.category = newCategory;
		await productRepo.save(product);

		return product;
	} catch (e: any) {
		logger.error(e.message);
	}
}

export async function updateProduct(item: NewProduct) {
	const categoryRepository = getRepository(ProductCategory);
	const productRepo = getRepository(Product);
	const inventoryRepo = getRepository(ProductInventory);
	try {
		const product = await productRepo.findOne({ where: { id: item.id } });
		if (product) {
			let category = await categoryRepository.findOne({
				where: { name: item.category },
			});
			if (!category) {
				const newCategory = categoryRepository.create({
					name: item.category,
				});
				await categoryRepository.save(newCategory);
				category = newCategory;
			}
			await inventoryRepo.update(
				{ id: item.inventory },
				{ quantity: item.quantity }
			);

			await productRepo.update(
				{ id: item.id },
				{
					name: item.name,
					price: item.price,
					imageUrl: item.imageUrl,
					description: item.description,
					category: category,
				}
			);
			logger.info("Update successful");
		}
	} catch (e: any) {
		logger.error(e.message);
	}
}

export async function getAllProductsFromDb() {
	try {
		const productRepo = getRepository(Product);
		return await productRepo.find({
			relations: ["inventory", "category"],
			cache: true,
		});
	} catch (e: any) {
		logger.error(e.message);
		return;
	}
}

import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { ProductCategory } from "./ProductCategory";
import { ProductInventory } from "./ProductInventory";
import { Min } from "class-validator";
import { CartItem } from "./CartItem";
import { OrderItems } from "./OrderItems";
import { FavouriteItems } from "./FavouriteItems";

@Entity({ name: "product" })
export class Product {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ nullable: false, unique: true })
	name: string;

	@Column()
	description: string;

	@Column({ nullable: false, type: "decimal" })
	@Min(0)
	price: number;

	@Column({ default: "" })
	imageUrl: string;

	@ManyToOne(() => ProductCategory, (category) => category.products)
	category: ProductCategory;

	@OneToMany(() => CartItem, (item) => item.product)
	cartItems: CartItem[];

	@OneToMany(() => OrderItems, (item) => item.product)
	orders: OrderItems[];

	@OneToMany(() => FavouriteItems, (item) => item.product)
	favs: FavouriteItems[];

	@OneToOne(() => ProductInventory)
	@JoinColumn()
	inventory: ProductInventory;

	@CreateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
		select: false,
	})
	created_at: Date;

	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
		onUpdate: "CURRENT_TIMESTAMP(6)",
		select: false,
	})
	modified_at: Date;
}

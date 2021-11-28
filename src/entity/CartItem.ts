import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { ShoppingSession } from "./ShoppingSession";
import { Product } from "./Product";
import { IsInt, Min } from "class-validator";

@Entity({ name: "cart_item" })
export class CartItem {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	@IsInt()
	@Min(1)
	quantity: number;

	@ManyToOne(() => ShoppingSession, (session) => session.cartItems, {
		onDelete: "CASCADE",
	})
	session: ShoppingSession;

	@ManyToOne(() => Product, (prod) => prod.cartItems)
	product: Product;

	@CreateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
	})
	createdAt: Date;

	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
		onUpdate: "CURRENT_TIMESTAMP(6)",
	})
	modifiedAt: Date;
}

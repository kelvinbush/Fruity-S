import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from "typeorm";
import { ShoppingSession } from "./ShoppingSession";
import { Product } from "./Product";
import { IsInt, Min } from "class-validator";

@Entity({ name: "cart_item" })
@Unique(["sessionId", "productId"])
export class CartItem {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	@IsInt()
	@Min(1)
	quantity: number;

	@ManyToOne(() => ShoppingSession, (session) => session.cartItems)
	@JoinColumn({ name: "sessionId" })
	session: ShoppingSession;

	@ManyToOne(() => Product, (prod) => prod.cartItems)
	@JoinColumn({ name: "productId" })
	product: Product;

	@Column()
	sessionId: string;

	@Column()
	productId: string;

	@CreateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
		select: false,
	})
	createdAt: Date;

	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(6)",
		onUpdate: "CURRENT_TIMESTAMP(6)",
		select: false,
	})
	modifiedAt: Date;
}

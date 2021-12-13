import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { CartItem } from "./CartItem";
import { Min } from "class-validator";

@Entity({ name: "shopping_session" })
export class ShoppingSession {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "decimal", default: 1 })
	@Min(1)
	total: number;

	@OneToMany(() => CartItem, (item) => item.session)
	cartItems: CartItem[];

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

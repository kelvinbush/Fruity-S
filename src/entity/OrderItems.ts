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
import { OrderDetails } from "./OrderDetails";
import { Product } from "./Product";
import { IsInt, Min } from "class-validator";

@Entity({ name: "order_items" })
export class OrderItems {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	@Min(0)
	@IsInt()
	quantity: number;

	@ManyToOne(() => OrderDetails, (order) => order.items)
	detail: OrderDetails;

	@ManyToOne(() => Product, (prod) => prod.orders)
	product: Product;

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

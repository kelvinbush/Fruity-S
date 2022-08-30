import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	JoinColumn,
	OneToMany,
} from "typeorm";
import { UserAddress } from "./UserAddress";
import { ShoppingSession } from "./ShoppingSession";
import { OrderDetails } from "./OrderDetails";
import { IsEmail } from "class-validator";
import { Favourite } from "./Favourite";

@Entity({ name: "user" })
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: number;

	@Column({ default: "" })
	firstName: string;

	@Column({ default: "" })
	lastName: string;

	@Column({ default: "" })
	imageUrl: string;

	@Column({ nullable: false, unique: true })
	username: string;

	@Column({ nullable: false })
	@IsEmail()
	email: string;

	@Column({ default: "" })
	telephone: string;

	@OneToOne(() => UserAddress)
	@JoinColumn()
	address: UserAddress;

	@OneToOne(() => ShoppingSession, { eager: true })
	@JoinColumn()
	shoppingSession: ShoppingSession;

	@OneToOne(() => Favourite, { eager: true })
	@JoinColumn()
	favourites: Favourite;

	@OneToMany(() => OrderDetails, (order) => order.user)
	orders: OrderDetails;

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

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "user_address" })
export class UserAddress {
	@PrimaryGeneratedColumn("uuid")
	id: number;

	@Column({ nullable: false })
	postalCode: string;

	@Column({ nullable: false })
	city: string;

	@Column({ nullable: false })
	addressLine1: string;

	@Column({ default: "" })
	addressLine2: string;

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

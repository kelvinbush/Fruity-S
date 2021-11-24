import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { OrderItems } from "./OrderItems";
import { Min } from "class-validator";

@Entity({ name: "order_details" })
export class OrderDetails {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "decimal" })
  @Min(0)
  total: number;

  @Column({ type: "boolean", default: false })
  status: boolean;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItems, (item) => item.detail)
  items: OrderItems[];

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  modified_at: Date;
}

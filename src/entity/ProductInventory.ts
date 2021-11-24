import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Min } from "class-validator";

@Entity({ name: "product_inventory" })
export class ProductInventory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, type: "int" })
  @Min(0)
  quantity: number;

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

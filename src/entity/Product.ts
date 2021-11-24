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
import { ProductCategory } from "./ProductCategory";
import { ProductInventory } from "./ProductInventory";
import { Min } from "class-validator";

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

  @OneToOne(() => ProductInventory)
  @JoinColumn()
  inventory: ProductInventory;

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

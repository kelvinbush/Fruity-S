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
import { Product } from "./Product";
import { Favourite } from "./Favourite";

@Entity({ name: "favourite_items" })
export class FavouriteItems {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Favourite, (item) => item.favouriteProducts)
	favourite: Favourite;

	@ManyToOne(() => Product, (prod) => prod.favs)
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

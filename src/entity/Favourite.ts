import {
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import {FavouriteItems} from "./FavouriteItems";

@Entity({name: "favourite"})
export class Favourite {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToMany(() => FavouriteItems, (item) => item.favourite, {cascade: ["remove"]})
    favouriteProducts: Favourite[];

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

import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import {CartItem} from "./CartItem";
import {Min} from "class-validator";

@Entity({name: "shopping_session"})
export class ShoppingSession {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "decimal"})
    @Min(0)
    total: number;

    @OneToMany(() => CartItem, (item) => item.session, {cascade: ["remove"]})
    cartItems: CartItem[];

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

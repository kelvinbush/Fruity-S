import {
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import argon2 from "argon2";
import {UserAddress} from "./UserAddress";
import {ShoppingSession} from "./ShoppingSession";
import {OrderDetails} from "./OrderDetails";
import {IsEmail} from "class-validator";
import {Favourite} from "./Favourite";
import {AuthSession} from "./AuthSession";
import logger from "../utils/logger";

@Entity({name: "user"})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({nullable: false})
    name: string;

    @Column({default: ""})
    imageUrl: string;

    @Column({default: "", nullable: false, select: false})
    password: string;

    @Column({nullable: false, unique: true})
    @IsEmail()
    email: string;

    @Column({default: ""})
    telephone: string;

    @OneToOne(() => UserAddress)
    @JoinColumn()
    address: UserAddress;

    @OneToOne(() => ShoppingSession, {eager: true})
    @JoinColumn()
    shoppingSession: ShoppingSession;

    @OneToOne(() => Favourite, {eager: true})
    @JoinColumn()
    favourites: Favourite;

    @OneToMany(() => OrderDetails, (order) => order.user)
    orders: OrderDetails;

    @OneToMany(() => AuthSession, (authSession) => authSession.user)
    authSessions: AuthSession;

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

    @BeforeUpdate()
    async hashPassword() {
        this.password = await argon2.hash(this.password);
    }

    async comparePassword(candidatePassword: string) {
        try {
            // await argon2.verify(this.password, candidatePassword);
            logger.info(this.password);
            return true;
        } catch (e: any) {
            logger.error(e.message);
            return false;
        }
    }
}

import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {User} from "./User";

@Entity({name: "auth_session"})
export class AuthSession {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({default: true, nullable: false})
    valid: boolean

    @Column({default: ""})
    userAgent: string

    @ManyToOne(() => User, (user) => user.authSessions)
    user: User;

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
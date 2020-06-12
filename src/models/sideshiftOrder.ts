import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {Account} from "./account";
import {SideshiftDeposit} from "./sideshiftDeposit";

@Entity()
export class SideshiftOrder {
    @PrimaryColumn()
    readonly id!: string;

    @Column()
    readonly accountId!: string;

    @Column()
    readonly createdAt!: string;

    @ManyToOne(
        _type => Account,
        account => account.orders,
        { eager: true }
    )
    readonly account!: Account;

    @Column()
    readonly depositMethodId!: string;

    @OneToMany(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        _type => SideshiftDeposit,
        deposit => deposit.order
    )
    readonly deposits!: SideshiftDeposit[];

}
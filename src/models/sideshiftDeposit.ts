import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {SideshiftOrder} from "./sideshiftOrder";

@Entity()
export class SideshiftDeposit {
    @PrimaryColumn()
    readonly id!: string;

    @Column()
    readonly orderId!: string;

    @ManyToOne(
        _type => SideshiftOrder,
        order => order.deposits,
        {eager: true}
    )

    readonly order!: SideshiftOrder;

    @Column()
    readonly createdAt!: string;

    @Column()
    status!: string;
}
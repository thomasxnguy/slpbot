import {Column, Entity, Index, ManyToOne, PrimaryColumn} from "typeorm";
import {Account} from "./account";

@Entity()
@Index(['id', 'tokenId'], {unique: true})
export class Transfer {
    @PrimaryColumn()
    readonly id!: string;

    @Column()
    readonly tokenId!: string;

    @Column()
    readonly createdAt!: string;

    @Column()
    readonly fromAccountId!: string;

    @ManyToOne(
        _type => Account,
        account => account.transfersOut,
        {eager: true}
    )
    readonly fromAccount!: Account;

    @Column()
    readonly toAccountId!: string;

    @ManyToOne(
        _type => Account,
        account => account.transfersIn,
        { eager: true }
    )
    readonly toAccount!: Account;

    @Column('numeric')
    readonly amount!: string;

    @Column('text', { nullable: true })
    readonly internalRef?: string | null;
}
import {Column, Entity, Index, ManyToOne, PrimaryColumn} from "typeorm";
import {Account} from "./account";
import {ColumnNumericTransformer} from "../utils";

/**
 * This table keeps track of all transfer pending for a non-registered user.
 */
@Entity()
export class TransferPending {
    /**
     * Unique UUID.
     */
    @PrimaryColumn()
    readonly id!: string;

    /**
     * Non registered user's username.
     */
    @Column()
    @Index("receivername-idx")
    readonly receiverName!: string;

    /**
     * Time of the transfer.
     */
    @Column()
    readonly createdAt!: string;

    /**
     * Currency of the transfer.
     */
    @Column()
    readonly tokenId!: string;

    /**
     * Sender.
     */
    @ManyToOne(
        _type => Account,
        account => account.transfersPending,
        {eager: true}
    )
    readonly fromAccount!: Account;

    /**
     * Amount transferred.
     */
    @Column('numeric', {
        transformer: new ColumnNumericTransformer(),
    })
    readonly amount!: number;
}
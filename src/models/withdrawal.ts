import {Column, Entity, Index, ManyToOne, PrimaryColumn} from "typeorm";
import {Account} from "./account";
import {ColumnNumericTransformer} from "../utils";

/**
 * This table keeps track of all user withdrawal.
 */
@Entity()
export class Withdrawal {
    /**
     * Unique UUID.
     */
    @PrimaryColumn()
    readonly txId!: string;

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
     * Address receiver.
     */
    @Column()
    readonly address!: string;

    /**
     * Sender.
     */
    @ManyToOne(
        _type => Account,
        account => account.transfersOut,
        {eager: true}
    )
    readonly fromAccount!: Account;

    /**
     * Amount withdraw.
     */
    @Column('numeric', {
        transformer: new ColumnNumericTransformer(),
    })
    readonly amount!: number;


    constructor(
        txId : string,
        tokenId : string,
        createdAt : string,
        address: string,
        fromAccount : Account,
        amount : number
    ){
        this.txId = txId;
        this.tokenId = tokenId;
        this.createdAt = createdAt;
        this.address = address;
        this.fromAccount = fromAccount;
        this.amount = amount;
    }
}
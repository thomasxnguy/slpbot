import {Column, Entity, Index, ManyToOne, PrimaryColumn} from "typeorm";
import {Account} from "./account";
import {ColumnNumericTransformer} from "../utils";

/**
 * This table keeps track of all transfer history between accounts.
 */
@Entity()
export class TransferHistory {

    /**
     * Unique UUID.
     */
    @PrimaryColumn()
    readonly id!: string;

    /**
     * Transfer currency.
     */
    @Column()
    readonly tokenId!: string;

    /**
     * Date of the transfer.
     */
    @Column()
    readonly createdAt!: string;

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
     * Receiver.
     */
    @ManyToOne(
        _type => Account,
        account => account.transfersIn,
        { eager: true }
    )
    readonly toAccount!: Account;

    /**
     * Amount transferred.
     */
    @Column('numeric', {
        transformer: new ColumnNumericTransformer(),
    })
    readonly amount!: number;


    constructor(
        id : string,
        tokenId : string,
        createdAt : string,
        fromAccount : Account,
        toAccount : Account,
        amount : number
    ){
        this.id = id;
        this.tokenId = tokenId;
        this.createdAt = createdAt;
        this.fromAccount = fromAccount;
        this.toAccount = toAccount;
        this.amount = amount;
    }

}
import {Column, Entity, Index, ManyToOne, PrimaryColumn} from "typeorm";
import {Account} from "./account";

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
    @Column()
    readonly fromAccountId!: string;

    @ManyToOne(
        _type => Account,
        account => account.transfersOut,
        {eager: true}
    )
    readonly fromAccount!: Account;

    /**
     * Receiver.
     */
    @Column()
    readonly toAccountId!: string;

    @ManyToOne(
        _type => Account,
        account => account.transfersIn,
        { eager: true }
    )
    readonly toAccount!: Account;

    /**
     * Amount transferred.
     */
    @Column('numeric')
    readonly amount!: string;


    constructor(
        id : string,
        tokenId : string,
        createdAt : string,
        fromAccountId : string,
        toAccountId : string,
        amount : string
    ){
        this.id = id;
        this.tokenId = tokenId;
        this.createdAt = createdAt;
        this.fromAccountId = fromAccountId;
        this.toAccountId = toAccountId;
        this.amount = amount;
    }

}
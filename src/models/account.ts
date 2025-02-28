import {Column, Entity, Index, OneToMany, PrimaryColumn} from "typeorm";
// eslint-disable-next-line import/no-cycle
import {TransferHistory} from "./transferHistory";
import {ColumnNumericTransformer} from "../utils";
// eslint-disable-next-line import/no-cycle
import {Withdrawal} from "./withdrawal";
// eslint-disable-next-line import/no-cycle
import {TransferPending} from "./transferPending";

@Entity()
/**
 * Account for a user. It is defined by its unique telegram id and the token id the bot supports.
 * Balance of user is tracked by this table.
 */
export class Account {

    /**
     * Telegram unique id.
     */
    @PrimaryColumn('text')
    readonly id!: string;

    /**
     * SLP Token id.
     */
    @PrimaryColumn('text')
    readonly tokenId!: string;

    /**
     * Account creation date.
     */
    @Column()
    readonly createdAt!: string;

    /**
     * Telegram username (unique but can be modified by user).
     */
    @Column('text', { nullable: true })
    @Index("username-idx")
    username?: string | null;

    /**
     * Balance for the couple (id, tokenId).
     */
    @Column('numeric', {
        transformer: new ColumnNumericTransformer(),
    })
    balance!: number;

    /**
     * History of all the transfer out.
     */
    @OneToMany(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        _type => TransferHistory,
        transfer => transfer.fromAccount
    )
    transfersOut!: TransferHistory[];

    /**
     * History of all the transfer in.
     */
    @OneToMany(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        _type => TransferHistory,
        transfer => transfer.toAccount
    )
    transfersIn!: TransferHistory[];

    /**
     * History of all pending transfer.
     */
    @OneToMany(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        _type => TransferPending,
        transfer => transfer.fromAccount
    )
    transfersPending!: TransferPending[];

    /**
     * History of all the transfer out.
     */
    @OneToMany(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        _type => Withdrawal,
        withdrawal => withdrawal.fromAccount
    )
    withdrawals!: Withdrawal[];


    /**
     * SlpAddress
     */
    @Column()
    readonly slpAddress!: string;


    constructor(
        id : string,
        tokenId : string,
        username : string,
        createdAt : string,
        balance : number,
        slpAddress: string,
    ){
        this.id = id;
        this.tokenId = tokenId;
        this.createdAt = createdAt;
        this.username = username;
        this.balance = balance;
        this.slpAddress = slpAddress;
    }

}
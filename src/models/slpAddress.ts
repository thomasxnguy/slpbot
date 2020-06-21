import {Column, Entity, Index, OneToMany, PrimaryColumn} from "typeorm";
import {TransferHistory} from "./transferHistory";
import {TxId} from "./txId";

@Entity()
/**
 * SlpAddress for an user
 */
export class SlpAddress {

    /**
     * Telegram unique id.
     */
    @PrimaryColumn('text')
    readonly address!: string;

    /**
     * Mnemonic
     */
    @Column()
    readonly mnemonic!: string;

    /**
     * Cash address
     */
    @Column()
    readonly cashAddress!: string;

    /**
     * LegacyAddress
     */
    @Column()
    readonly legacyAddress!: string;

    /**
     * Telegram id of user
     */
    @Column()
    @Index("userId-idx")
    readonly userId!: string;


    /**
     * Account creation date.
     */
    @Column()
    readonly createdAt!: string;

    /**
     * History of all tx in from deposit.
     */
    @OneToMany(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        _type => TxId,
        transaction => transaction.in
    )
    txIn!: TransferHistory[];

    constructor(
        address : string,
        mnemonic : string,
        cashAddress : string,
        legacyAddress : string,
        createdAt : string,
        userId : string,
    ){
        this.address = address;
        this.mnemonic = mnemonic;
        this.cashAddress = cashAddress;
        this.legacyAddress = legacyAddress;
        this.createdAt = createdAt;
        this.userId = userId;
    }

}
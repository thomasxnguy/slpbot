import {Column, Entity, Index, ManyToOne, PrimaryColumn} from "typeorm";
import {Account} from "./account";
import {ColumnNumericTransformer} from "../utils";
import {SlpAddress} from "./slpAddress";

/**
 * This table keeps track of all txId for deposit.
 */
@Entity()
export class TxId {

    /**
     * Unique txId.
     */
    @PrimaryColumn()
    readonly id!: string;

    @Column()
    readonly amount!: number;

    @Column()
    readonly createdAt!: string;

    /**
     * Status of the txId.
     *  Pending : waiting for confirmation
     *  Paid : user account accredited
     *  Terminated : amount moved to bot address
     */
    @Column()
    readonly status!: string;

    /**
     * Record of the user address.
     */
    @ManyToOne(
        _type => SlpAddress,
        account => account.txIn,
        { eager: true }
    )
    readonly in!: SlpAddress;



    constructor(
        id : string,
        createdAt : string,
        amount : number,
        status: string
    ){
        this.id = id;
        this.createdAt = createdAt;
        this.amount = amount;
        this.status = status;
    }

}
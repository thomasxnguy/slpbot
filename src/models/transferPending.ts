import {Column, Entity, Index, ManyToOne, PrimaryColumn} from "typeorm";
import {Account} from "./account";

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
    @Column()
    readonly fromAccountId!: string;

    /**
     * Amount transferred.
     */
    @Column('numeric')
    readonly amount!: string;
}
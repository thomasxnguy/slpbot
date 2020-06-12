import {Column, Entity, Index, OneToMany, PrimaryColumn} from "typeorm";
import {Transfer} from "./transfer";
import {SideshiftOrder} from "./sideshiftOrder";

@Entity()
@Index(['id', 'tokenId'], {unique: true})
/**
 * Account with a balance
 */
export class Account {
    @PrimaryColumn('text')
    /**
     * Unique identifier for the account. Telegram unique id is used for user accounts,
     * hard coded
     */
    readonly id!: string;

    @Column('text')
    readonly tokenId!: string;

    @Column()
    readonly createdAt!: string;

    @Column('text', { nullable: true })
    readonly username?: string | null;

    @Column('numeric')
    readonly balance!: string;

    @OneToMany(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        _type => SideshiftOrder,
        order => order.account
    )
    readonly orders!: SideshiftOrder[];

    @OneToMany(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        _type => Transfer,
        transfer => transfer.fromAccount
    )
    readonly transfersOut!: Transfer[];

    @OneToMany(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        _type => Transfer,
        transfer => transfer.toAccount
    )
    readonly transfersIn!: Transfer[];
}
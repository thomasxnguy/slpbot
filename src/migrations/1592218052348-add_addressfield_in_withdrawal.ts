import {MigrationInterface, QueryRunner} from "typeorm";

export class addAddressfieldInWithdrawal1592218052348 implements MigrationInterface {
    name = 'addAddressfieldInWithdrawal1592218052348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD "address" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP COLUMN "address"`);
    }

}

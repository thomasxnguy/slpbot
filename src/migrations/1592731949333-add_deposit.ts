import {MigrationInterface, QueryRunner} from "typeorm";

export class addDeposit1592731949333 implements MigrationInterface {
    name = 'addDeposit1592731949333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "slp_address" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "slp_address"`);
    }

}

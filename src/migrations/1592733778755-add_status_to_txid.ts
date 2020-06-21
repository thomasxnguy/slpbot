import {MigrationInterface, QueryRunner} from "typeorm";

export class addStatusToTxid1592733778755 implements MigrationInterface {
    name = 'addStatusToTxid1592733778755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tx_id" DROP CONSTRAINT "FK_68d1a379e11991847c449685411"`);
        await queryRunner.query(`ALTER TABLE "tx_id" RENAME COLUMN "out_address" TO "status"`);
        await queryRunner.query(`ALTER TABLE "tx_id" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "tx_id" ADD "status" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tx_id" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "tx_id" ADD "status" text`);
        await queryRunner.query(`ALTER TABLE "tx_id" RENAME COLUMN "status" TO "out_address"`);
        await queryRunner.query(`ALTER TABLE "tx_id" ADD CONSTRAINT "FK_68d1a379e11991847c449685411" FOREIGN KEY ("out_address") REFERENCES "slp_address"("address") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

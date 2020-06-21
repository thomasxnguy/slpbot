import {MigrationInterface, QueryRunner} from "typeorm";

export class addSlpAddress1592732034019 implements MigrationInterface {
    name = 'addSlpAddress1592732034019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tx_id" ("id" character varying NOT NULL, "amount" integer NOT NULL, "created_at" character varying NOT NULL, "out_address" text, "in_address" text, CONSTRAINT "PK_5e70da3c80a155e00be7f560c6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "slp_address" ("address" text NOT NULL, "mnemonic" character varying NOT NULL, "cash_address" character varying NOT NULL, "legacy_address" character varying NOT NULL, "user_id" character varying NOT NULL, "created_at" character varying NOT NULL, CONSTRAINT "PK_467e2cf10540f6a59d320ac747b" PRIMARY KEY ("address"))`);
        await queryRunner.query(`CREATE INDEX "userId-idx" ON "slp_address" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "tx_id" ADD CONSTRAINT "FK_68d1a379e11991847c449685411" FOREIGN KEY ("out_address") REFERENCES "slp_address"("address") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tx_id" ADD CONSTRAINT "FK_905b808de345dbc368b53c813ce" FOREIGN KEY ("in_address") REFERENCES "slp_address"("address") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tx_id" DROP CONSTRAINT "FK_905b808de345dbc368b53c813ce"`);
        await queryRunner.query(`ALTER TABLE "tx_id" DROP CONSTRAINT "FK_68d1a379e11991847c449685411"`);
        await queryRunner.query(`DROP INDEX "userId-idx"`);
        await queryRunner.query(`DROP TABLE "slp_address"`);
        await queryRunner.query(`DROP TABLE "tx_id"`);
    }

}

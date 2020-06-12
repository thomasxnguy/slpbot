import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1591953775231 implements MigrationInterface {
    name = 'initial1591953775231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "token_id" character varying NOT NULL, "created_at" character varying NOT NULL, "from_account_id" text NOT NULL, "to_account_id" text NOT NULL, "amount" numeric NOT NULL, "internal_ref" text, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_bc2a43fd21f6c1c6262cbbfbd3" ON "transfer" ("id", "token_id") `);
        await queryRunner.query(`CREATE TABLE "sideshift_deposit" ("id" character varying NOT NULL, "order_id" character varying NOT NULL, "created_at" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_07226bee033144e9a3aa6c6656a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sideshift_order" ("id" character varying NOT NULL, "account_id" text NOT NULL, "created_at" character varying NOT NULL, "deposit_method_id" character varying NOT NULL, CONSTRAINT "PK_5db4293cda6298b618cae5bf6d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("id" text NOT NULL, "token_id" text NOT NULL, "created_at" character varying NOT NULL, "username" text, "balance" numeric NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4492a66da115e137aea10b1727" ON "account" ("id", "token_id") `);
        await queryRunner.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_e2f71240f767a903a4fe85ce25a" FOREIGN KEY ("from_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_e588c446185bd0c7e4861bb66bb" FOREIGN KEY ("to_account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sideshift_deposit" ADD CONSTRAINT "FK_3251118adb8b451b8a5cb01fdf5" FOREIGN KEY ("order_id") REFERENCES "sideshift_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sideshift_order" ADD CONSTRAINT "FK_db2cf6f24c15390e9518c257f57" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sideshift_order" DROP CONSTRAINT "FK_db2cf6f24c15390e9518c257f57"`);
        await queryRunner.query(`ALTER TABLE "sideshift_deposit" DROP CONSTRAINT "FK_3251118adb8b451b8a5cb01fdf5"`);
        await queryRunner.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_e588c446185bd0c7e4861bb66bb"`);
        await queryRunner.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_e2f71240f767a903a4fe85ce25a"`);
        await queryRunner.query(`DROP INDEX "IDX_4492a66da115e137aea10b1727"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "sideshift_order"`);
        await queryRunner.query(`DROP TABLE "sideshift_deposit"`);
        await queryRunner.query(`DROP INDEX "IDX_bc2a43fd21f6c1c6262cbbfbd3"`);
        await queryRunner.query(`DROP TABLE "transfer"`);
    }

}

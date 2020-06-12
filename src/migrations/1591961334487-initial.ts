import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1591961334487 implements MigrationInterface {
    name = 'initial1591961334487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transfer_history" ("id" character varying NOT NULL, "token_id" character varying NOT NULL, "created_at" character varying NOT NULL, "from_account_id" text NOT NULL, "to_account_id" text NOT NULL, "amount" numeric NOT NULL, "internal_ref" text, "from_account_token_id" text, "to_account_token_id" text, CONSTRAINT "PK_de9d5f878bf4ff562ffaa318251" PRIMARY KEY ("id", "token_id"))`);
        await queryRunner.query(`CREATE TABLE "sideshift_deposit" ("id" character varying NOT NULL, "order_id" character varying NOT NULL, "created_at" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_07226bee033144e9a3aa6c6656a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sideshift_order" ("id" character varying NOT NULL, "account_id" text NOT NULL, "created_at" character varying NOT NULL, "deposit_method_id" character varying NOT NULL, "account_token_id" text, CONSTRAINT "PK_5db4293cda6298b618cae5bf6d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("id" text NOT NULL, "token_id" text NOT NULL, "created_at" character varying NOT NULL, "username" text, "balance" numeric NOT NULL, CONSTRAINT "PK_4492a66da115e137aea10b17271" PRIMARY KEY ("id", "token_id"))`);
        await queryRunner.query(`ALTER TABLE "transfer_history" ADD CONSTRAINT "FK_4187df7125e5961883990771bd9" FOREIGN KEY ("from_account_id", "from_account_token_id") REFERENCES "account"("id","token_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer_history" ADD CONSTRAINT "FK_a9f8b90a8feb7b94e5616eea9f2" FOREIGN KEY ("to_account_id", "to_account_token_id") REFERENCES "account"("id","token_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sideshift_deposit" ADD CONSTRAINT "FK_3251118adb8b451b8a5cb01fdf5" FOREIGN KEY ("order_id") REFERENCES "sideshift_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sideshift_order" ADD CONSTRAINT "FK_88d24f4438ea6dcd94c4e7e4a5b" FOREIGN KEY ("account_id", "account_token_id") REFERENCES "account"("id","token_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sideshift_order" DROP CONSTRAINT "FK_88d24f4438ea6dcd94c4e7e4a5b"`);
        await queryRunner.query(`ALTER TABLE "sideshift_deposit" DROP CONSTRAINT "FK_3251118adb8b451b8a5cb01fdf5"`);
        await queryRunner.query(`ALTER TABLE "transfer_history" DROP CONSTRAINT "FK_a9f8b90a8feb7b94e5616eea9f2"`);
        await queryRunner.query(`ALTER TABLE "transfer_history" DROP CONSTRAINT "FK_4187df7125e5961883990771bd9"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "sideshift_order"`);
        await queryRunner.query(`DROP TABLE "sideshift_deposit"`);
        await queryRunner.query(`DROP TABLE "transfer_history"`);
    }

}

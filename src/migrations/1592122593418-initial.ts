import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1592122593418 implements MigrationInterface {
    name = 'initial1592122593418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transfer_history" ("id" character varying NOT NULL, "token_id" character varying NOT NULL, "created_at" character varying NOT NULL, "from_account_id" text NOT NULL, "to_account_id" text NOT NULL, "amount" numeric NOT NULL, "from_account_token_id" text, "to_account_token_id" text, CONSTRAINT "PK_34abd51f724bd9604b046ce3e05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("id" text NOT NULL, "token_id" text NOT NULL, "created_at" character varying NOT NULL, "username" text, "balance" numeric NOT NULL, CONSTRAINT "PK_4492a66da115e137aea10b17271" PRIMARY KEY ("id", "token_id"))`);
        await queryRunner.query(`CREATE INDEX "username-idx" ON "account" ("username") `);
        await queryRunner.query(`CREATE TABLE "transfer_pending" ("id" character varying NOT NULL, "receiver_name" character varying NOT NULL, "created_at" character varying NOT NULL, "token_id" character varying NOT NULL, "from_account_id" character varying NOT NULL, "amount" numeric NOT NULL, CONSTRAINT "PK_1d451a8cc16ea2e9a09c69073cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "receivername-idx" ON "transfer_pending" ("receiver_name") `);
        await queryRunner.query(`ALTER TABLE "transfer_history" ADD CONSTRAINT "FK_4187df7125e5961883990771bd9" FOREIGN KEY ("from_account_id", "from_account_token_id") REFERENCES "account"("id","token_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer_history" ADD CONSTRAINT "FK_a9f8b90a8feb7b94e5616eea9f2" FOREIGN KEY ("to_account_id", "to_account_token_id") REFERENCES "account"("id","token_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transfer_history" DROP CONSTRAINT "FK_a9f8b90a8feb7b94e5616eea9f2"`);
        await queryRunner.query(`ALTER TABLE "transfer_history" DROP CONSTRAINT "FK_4187df7125e5961883990771bd9"`);
        await queryRunner.query(`DROP INDEX "receivername-idx"`);
        await queryRunner.query(`DROP TABLE "transfer_pending"`);
        await queryRunner.query(`DROP INDEX "username-idx"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "transfer_history"`);
    }

}

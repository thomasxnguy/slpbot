import {MigrationInterface, QueryRunner} from "typeorm";

export class addWithdrawal1592136290558 implements MigrationInterface {
    name = 'addWithdrawal1592136290558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "withdrawal" ("tx_id" character varying NOT NULL, "created_at" character varying NOT NULL, "token_id" character varying NOT NULL, "amount" numeric NOT NULL, "from_account_id" text, "from_account_token_id" text, CONSTRAINT "PK_d342fbe0f771ccedc4321768644" PRIMARY KEY ("tx_id"))`);
        await queryRunner.query(`ALTER TABLE "transfer_pending" ADD "from_account_token_id" text`);
        await queryRunner.query(`ALTER TABLE "transfer_history" DROP CONSTRAINT "FK_4187df7125e5961883990771bd9"`);
        await queryRunner.query(`ALTER TABLE "transfer_history" DROP CONSTRAINT "FK_a9f8b90a8feb7b94e5616eea9f2"`);
        await queryRunner.query(`ALTER TABLE "transfer_history" ALTER COLUMN "from_account_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transfer_history" ALTER COLUMN "to_account_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transfer_pending" DROP COLUMN "from_account_id"`);
        await queryRunner.query(`ALTER TABLE "transfer_pending" ADD "from_account_id" text`);
        await queryRunner.query(`ALTER TABLE "transfer_history" ADD CONSTRAINT "FK_4187df7125e5961883990771bd9" FOREIGN KEY ("from_account_id", "from_account_token_id") REFERENCES "account"("id","token_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer_history" ADD CONSTRAINT "FK_a9f8b90a8feb7b94e5616eea9f2" FOREIGN KEY ("to_account_id", "to_account_token_id") REFERENCES "account"("id","token_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_c0aeb229db965e08ab5e8116bfa" FOREIGN KEY ("from_account_id", "from_account_token_id") REFERENCES "account"("id","token_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer_pending" ADD CONSTRAINT "FK_a3aa1869bc91054d4935a4e505a" FOREIGN KEY ("from_account_id", "from_account_token_id") REFERENCES "account"("id","token_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transfer_pending" DROP CONSTRAINT "FK_a3aa1869bc91054d4935a4e505a"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_c0aeb229db965e08ab5e8116bfa"`);
        await queryRunner.query(`ALTER TABLE "transfer_history" DROP CONSTRAINT "FK_a9f8b90a8feb7b94e5616eea9f2"`);
        await queryRunner.query(`ALTER TABLE "transfer_history" DROP CONSTRAINT "FK_4187df7125e5961883990771bd9"`);
        await queryRunner.query(`ALTER TABLE "transfer_pending" DROP COLUMN "from_account_id"`);
        await queryRunner.query(`ALTER TABLE "transfer_pending" ADD "from_account_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transfer_history" ALTER COLUMN "to_account_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transfer_history" ALTER COLUMN "from_account_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transfer_history" ADD CONSTRAINT "FK_a9f8b90a8feb7b94e5616eea9f2" FOREIGN KEY ("to_account_id", "to_account_token_id") REFERENCES "account"("id","token_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer_history" ADD CONSTRAINT "FK_4187df7125e5961883990771bd9" FOREIGN KEY ("from_account_id", "from_account_token_id") REFERENCES "account"("id","token_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfer_pending" DROP COLUMN "from_account_token_id"`);
        await queryRunner.query(`DROP TABLE "withdrawal"`);
    }

}

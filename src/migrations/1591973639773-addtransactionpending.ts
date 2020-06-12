import {MigrationInterface, QueryRunner} from "typeorm";

export class addtransactionpending1591973639773 implements MigrationInterface {
    name = 'addtransactionpending1591973639773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transfer_pending" ("id" character varying NOT NULL, "receiver_name" character varying NOT NULL, "created_at" character varying NOT NULL, "token_id" character varying NOT NULL, "from_account_id" character varying NOT NULL, "amount" numeric NOT NULL, CONSTRAINT "PK_1d451a8cc16ea2e9a09c69073cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "receivername-idx" ON "transfer_pending" ("receiver_name") `);
        await queryRunner.query(`ALTER TABLE "transfer_history" DROP COLUMN "internal_ref"`);
        await queryRunner.query(`ALTER TABLE "transfer_history" DROP CONSTRAINT "PK_de9d5f878bf4ff562ffaa318251"`);
        await queryRunner.query(`ALTER TABLE "transfer_history" ADD CONSTRAINT "PK_34abd51f724bd9604b046ce3e05" PRIMARY KEY ("id")`);
        await queryRunner.query(`CREATE INDEX "username-idx" ON "account" ("username") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "username-idx"`);
        await queryRunner.query(`ALTER TABLE "transfer_history" DROP CONSTRAINT "PK_34abd51f724bd9604b046ce3e05"`);
        await queryRunner.query(`ALTER TABLE "transfer_history" ADD CONSTRAINT "PK_de9d5f878bf4ff562ffaa318251" PRIMARY KEY ("id", "token_id")`);
        await queryRunner.query(`ALTER TABLE "transfer_history" ADD "internal_ref" text`);
        await queryRunner.query(`DROP INDEX "receivername-idx"`);
        await queryRunner.query(`DROP TABLE "transfer_pending"`);
    }

}

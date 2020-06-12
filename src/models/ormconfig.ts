import {ConnectionOptions} from "typeorm";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import {Account} from "./account";
import {SideshiftOrder} from "./sideshiftOrder";
import {SideshiftDeposit} from "./sideshiftDeposit";
import {Transfer} from "./transfer";

// Config file for ORM Migration
const config: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'slpbotdb',
    entities: [Account, SideshiftOrder, SideshiftDeposit, Transfer],
    logging: "all",
    namingStrategy: new SnakeNamingStrategy(),
    ssl: process.env.DATABASE_SSL === `true`,
    migrations: [
        "src/migrations/*.ts"
    ],
    cli: {
        migrationsDir: 'src/migrations',
    }
};
export = config;
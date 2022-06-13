"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220613103247 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220613103247 extends migrations_1.Migration {
    async up() {
        this.addSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        this.addSql('create table "cat" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null);');
        this.addSql('alter table "cat" add constraint "cat_pkey" primary key ("id");');
        this.addSql('create table "user" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null);');
        this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');
    }
    async down() {
        this.addSql('drop table if exists "cat" cascade;');
        this.addSql('drop table if exists "user" cascade;');
    }
}
exports.Migration20220613103247 = Migration20220613103247;
//# sourceMappingURL=Migration20220613103247.js.map
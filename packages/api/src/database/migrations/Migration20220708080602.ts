import { Migration } from '@mikro-orm/migrations';

export class Migration20220708080602 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "content" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "post_id" uuid not null, "url" varchar(255) not null, "content_type" varchar(255) not null);');
    this.addSql('alter table "content" add constraint "content_pkey" primary key ("id");');

    this.addSql('alter table "content" add constraint "content_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "content" cascade;');
  }

}

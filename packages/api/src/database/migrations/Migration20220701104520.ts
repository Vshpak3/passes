import { Migration } from '@mikro-orm/migrations';

export class Migration20220701104520 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "oauth_id" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop column "oauth_id";');
  }

}

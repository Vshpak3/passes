import { Migration } from '@mikro-orm/migrations';

export class Migration20220701104153 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "oauth_provider" varchar(255) null, add column "is_disabled" boolean null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop column "oauth_provider";');
    this.addSql('alter table "users" drop column "is_disabled";');
  }

}

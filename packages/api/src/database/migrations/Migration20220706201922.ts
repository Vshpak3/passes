import { Migration } from '@mikro-orm/migrations';

export class Migration20220706201922 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "profile" add column "profile_image_url" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "profile" drop column "profile_image_url";');
  }

}

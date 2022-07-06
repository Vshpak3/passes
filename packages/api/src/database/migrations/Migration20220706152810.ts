import { Migration } from '@mikro-orm/migrations';

export class Migration20220706152810 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "profile" add column "is_active" boolean not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "profile" drop column "is_active";');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20221017055254 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `channel` modify `recent` datetime null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `channel` modify `recent` datetime not null default CURRENT_TIMESTAMP;');
  }

}

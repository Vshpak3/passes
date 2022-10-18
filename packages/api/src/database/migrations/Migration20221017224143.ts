import { Migration } from '@mikro-orm/migrations'

export class Migration20221017224143 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `channel` modify `preview_text` varchar(10000);')
  }

  async down(): Promise<void> {
    this.addSql('alter table `channel` modify `preview_text` varchar(255);')
  }
}

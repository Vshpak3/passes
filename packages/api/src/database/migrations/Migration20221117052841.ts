import { Migration } from '@mikro-orm/migrations'

export class Migration20221117052841 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `message` add index `message_read_at_index`(`read_at`);',
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table `message` drop index `message_read_at_index`;')
  }
}

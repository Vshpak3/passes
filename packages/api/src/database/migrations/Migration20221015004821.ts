import { Migration } from '@mikro-orm/migrations'

export class Migration20221015004821 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `scheduled_event` add index `scheduled_event_scheduled_at_index`(`scheduled_at`);',
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `scheduled_event` drop index `scheduled_event_scheduled_at_index`;',
    )
  }
}

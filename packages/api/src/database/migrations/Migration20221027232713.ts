import { Migration } from '@mikro-orm/migrations'

export class Migration20221027232713 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table `creator_settings` modify `payout_frequency` enum('manual', 'two weeks', 'four weeks', 'one week') not null default 'manual';",
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `paid_message_history` add `paid` int not null default 0;',
    )

    this.addSql(
      "alter table `creator_settings` modify `payout_frequency` enum('manual', 'two weeks', 'one week') not null default 'manual';",
    )
  }
}

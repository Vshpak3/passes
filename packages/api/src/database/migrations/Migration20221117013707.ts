import { Migration } from '@mikro-orm/migrations'

export class Migration20221117013707 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `creator_share` modify `processed` int not null default 0;',
    )

    this.addSql(
      'alter table `circle_chargeback` add `processed` int not null default 0;',
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `creator_share` modify `processed` tinyint(1) not null;',
    )
  }
}

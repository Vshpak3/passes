import { Migration } from '@mikro-orm/migrations'

export class Migration20221011055922 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `pass` modify `total_supply` int null, modify `remaining_supply` int null default 0;',
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `pass` modify `total_supply` int not null, modify `remaining_supply` int not null default 0;',
    )
  }
}

import { Migration } from '@mikro-orm/migrations'

export class Migration20221011060709 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `pass` modify `remaining_supply` int;')
  }

  async down(): Promise<void> {
    this.addSql('alter table `pass` modify `remaining_supply` int default 0;')
  }
}

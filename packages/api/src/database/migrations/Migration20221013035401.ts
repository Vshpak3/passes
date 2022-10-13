import { Migration } from '@mikro-orm/migrations'

export class Migration20221013035401 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `paid_message` add `sent_to` int not null default 0;',
    )
  }
}

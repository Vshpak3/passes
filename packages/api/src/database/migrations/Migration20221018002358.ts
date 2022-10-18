import { Migration } from '@mikro-orm/migrations'

export class Migration20221018002358 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `message` add `paying` tinyint(1) not null default false;',
    )
  }
}

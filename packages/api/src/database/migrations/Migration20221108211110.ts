import { Migration } from '@mikro-orm/migrations'

export class Migration20221108211110 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `message` add `automatic` tinyint(1) not null default false;',
    )
  }
}

import { Migration } from '@mikro-orm/migrations'

export class Migration20221118002221 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `post_category` modify `name` varchar(50) not null, modify `order` int not null default 0;',
    )

    this.addSql(
      'alter table `channel_member` add `unread_count` int not null default 0;',
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `post_category` modify `name` varchar(25) not null, modify `order` int not null;',
    )
  }
}

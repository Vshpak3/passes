import { Migration } from '@mikro-orm/migrations'

export class Migration20221120024412 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `users` modify `public` tinyint(1) not null default false;',
    )

    this.addSql(
      'alter table `pass` add `amount_minted` int not null default 0;',
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `users` modify `public` tinyint(1) not null default true;',
    )
  }
}

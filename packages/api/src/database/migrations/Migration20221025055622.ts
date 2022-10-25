import { Migration } from '@mikro-orm/migrations'

export class Migration20221025055622 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `users` add `featured` tinyint(1) not null default false;',
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table `users` drop `featured`;')
  }
}

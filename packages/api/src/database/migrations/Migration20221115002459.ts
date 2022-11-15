import { Migration } from '@mikro-orm/migrations'

export class Migration20221115002459 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `users` modify `featured` int not null default 0;')
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `users` modify `featured` tinyint(1) not null default false;',
    )
  }
}

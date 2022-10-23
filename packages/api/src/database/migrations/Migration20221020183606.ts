import { Migration } from '@mikro-orm/migrations'

export class Migration20221020183606 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `users` modify `display_name` varchar(50) not null;',
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table `users` modify `display_name` varchar(50) null;')
  }
}

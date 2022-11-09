import { Migration } from '@mikro-orm/migrations';

export class Migration20221109082021 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `list` modify `name` varchar(50) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `list` modify `name` varchar(50) not null;');
  }

}

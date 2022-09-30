import { Migration } from '@mikro-orm/migrations';

export class Migration20220930152945 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `pass` modify `freetrial` tinyint(1) not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `pass` modify `freetrial` tinyint(1) not null;');
  }

}

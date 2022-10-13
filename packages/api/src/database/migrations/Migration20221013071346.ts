import { Migration } from '@mikro-orm/migrations';

export class Migration20221013071346 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `paid_message` add `unsent` tinyint(1) not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `paid_message` add `paid` int not null default 0;');
  }

}

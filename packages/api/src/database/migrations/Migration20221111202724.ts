import { Migration } from '@mikro-orm/migrations';

export class Migration20221111202724 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `paid_message` add `viewed` int not null default 0;');
  }

}

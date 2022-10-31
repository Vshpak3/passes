import { Migration } from '@mikro-orm/migrations';

export class Migration20221031135343 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `agency` add `available_balance` decimal(12, 2) not null;');
  }

}

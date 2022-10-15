import { Migration } from '@mikro-orm/migrations';

export class Migration20221015051004 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `list` add `deleted_at` datetime null;');
  }

}

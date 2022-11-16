import { Migration } from '@mikro-orm/migrations';

export class Migration20221116015924 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `creator_share` add `processed` tinyint(1) not null;');
  }

}

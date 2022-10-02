import { Migration } from '@mikro-orm/migrations';

export class Migration20221002003403 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `creator_stat` add `num_posts` int not null default 0;');
  }

}

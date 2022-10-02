import { Migration } from '@mikro-orm/migrations';

export class Migration20221002004307 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `creator_settings` add `show_like_count` tinyint(1) not null default true, add `show_post_count` tinyint(1) not null default true;');
  }

}

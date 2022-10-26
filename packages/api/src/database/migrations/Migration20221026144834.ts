import { Migration } from '@mikro-orm/migrations';

export class Migration20221026144834 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `message` add `paid_at` datetime null;');

    this.addSql('alter table `post_user_access` add `paid_at` datetime null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `message` add `paid` tinyint(1) not null default false;');

    this.addSql('alter table `post_user_access` add `paid` tinyint(1) not null default false;');
  }

}

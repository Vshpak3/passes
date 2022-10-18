import { Migration } from '@mikro-orm/migrations'

export class Migration20221018040518 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `post_user_access` add `paid` tinyint(1) not null default false, add `paying` tinyint(1) not null default false;',
    )
  }
}

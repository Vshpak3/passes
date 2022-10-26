import { Migration } from '@mikro-orm/migrations'

export class Migration20221026225352 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table `post_user_access` modify `pass_holder_ids` varchar(500) not null default '[]';",
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `post_user_access` modify `pass_holder_ids` varchar(500) not null;',
    )
  }
}

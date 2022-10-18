import { Migration } from '@mikro-orm/migrations';

export class Migration20221018034008 extends Migration {

  async up(): Promise<void> {
    this.addSql(
      "alter table `post` modify `tags` varchar(350) not null default '[]';",
    )
  }

  async down(): Promise<void> {
    this.addSql(
      "alter table `post` modify `tags` varchar(200) not null default '[]';",
    )
  }
}

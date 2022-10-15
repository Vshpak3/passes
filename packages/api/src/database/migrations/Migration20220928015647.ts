import { Migration } from '@mikro-orm/migrations'

export class Migration20220928015647 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table `post` modify `pass_ids` varchar(3000) not null default '[]';",
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table `post` modify `pass_ids` varchar(3000) null;')
  }
}

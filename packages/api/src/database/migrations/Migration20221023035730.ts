import { Migration } from '@mikro-orm/migrations'

export class Migration20221023035730 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `content` add `failed` tinyint(1) not null default false',
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table `content` drop `failed`;')
  }
}

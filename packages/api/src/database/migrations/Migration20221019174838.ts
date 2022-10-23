import { Migration } from '@mikro-orm/migrations'

export class Migration20221019174838 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `post` add `content_processed` tinyint(1) not null default false;',
    )
    this.addSql(
      'alter table `content` add `processed` tinyint(1) not null default false;',
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table `post` drop `content_processed`;')
    this.addSql('alter table `content` drop `processed`;')
  }
}

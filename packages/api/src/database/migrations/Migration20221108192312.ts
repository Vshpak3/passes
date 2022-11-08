import { Migration } from '@mikro-orm/migrations';

export class Migration20221108192312 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `post` add `hidden_at` datetime(3) null;');

    this.addSql('alter table `paid_message` add `unsent_at` datetime(3) null, add `hidden_at` datetime(3) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `paid_message` add `unsent` tinyint(1) not null default false;');
  }

}

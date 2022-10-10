import { Migration } from '@mikro-orm/migrations';

export class Migration20221010154919 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `pass` add index `pass_pinned_at_index`(`pinned_at`);');

    this.addSql('alter table `message` add `has_content` tinyint(1) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `pass` drop index `pass_pinned_at_index`;');
  }

}

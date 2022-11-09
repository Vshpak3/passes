import { Migration } from '@mikro-orm/migrations';

export class Migration20221109163438 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `pass` add unique `pass_creator_id_title_unique`(`creator_id`, `title`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `pass` drop index `pass_creator_id_title_unique`;');
  }

}

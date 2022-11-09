import { Migration } from '@mikro-orm/migrations';

export class Migration20221109065425 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `list` add unique `list_name_user_id_unique`(`name`, `user_id`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `list` drop index `list_name_user_id_unique`;');
  }

}

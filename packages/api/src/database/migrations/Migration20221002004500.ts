import { Migration } from '@mikro-orm/migrations';

export class Migration20221002004500 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `creator_stat` drop column `show_media_count`;');
  }

}

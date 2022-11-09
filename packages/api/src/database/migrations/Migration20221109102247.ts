import { Migration } from '@mikro-orm/migrations';

export class Migration20221109102247 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `channel_member` add `read_at` datetime(3) null;');
  }

}

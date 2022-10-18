import { Migration } from '@mikro-orm/migrations'

export class Migration20221017224057 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `channel` add `preview_text` varchar(255) null;')
  }
}

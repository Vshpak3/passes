import { Migration } from '@mikro-orm/migrations'

export class Migration20221117051922 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `message` add `read_at` datetime(3) null;')
  }
}

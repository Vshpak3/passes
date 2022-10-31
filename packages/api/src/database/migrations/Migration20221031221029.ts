import { Migration } from '@mikro-orm/migrations'

export class Migration20221031221029 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `message` add `deleted_at` datetime(3) null;')
  }
}

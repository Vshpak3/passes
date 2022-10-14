import { Migration } from '@mikro-orm/migrations'

export class Migration20221014003316 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `payin` add `redirect_url` varchar(512) null;')
  }
}

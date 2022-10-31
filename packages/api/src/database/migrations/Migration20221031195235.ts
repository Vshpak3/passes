import { Migration } from '@mikro-orm/migrations';

export class Migration20221031195235 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `payin` add `ip_address` varchar(39) null, add `session_id` varchar(64) null;');
  }

}

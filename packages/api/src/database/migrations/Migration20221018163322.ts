import { Migration } from '@mikro-orm/migrations';

export class Migration20221018163322 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `pass_holder` modify `access_type` enum(\'pass_access\', \'account_access\') not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `pass_holder` modify `access_type` enum(\'pass access\', \'account_access\') not null;');
  }

}

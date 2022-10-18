import { Migration } from '@mikro-orm/migrations'

export class Migration20221018192840 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `default_wallet` drop index `default_wallet_user_id_unique`;',
    )
    this.addSql(
      'alter table `default_wallet` add index `default_wallet_user_id_index`(`user_id`);',
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `default_wallet` drop index `default_wallet_user_id_index`;',
    )
    this.addSql(
      'alter table `default_wallet` add unique `default_wallet_user_id_unique`(`user_id`);',
    )
  }
}

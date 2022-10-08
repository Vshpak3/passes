import { Migration } from '@mikro-orm/migrations';

export class Migration20221008003743 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `eth_nonce` drop index `eth_nonce_key_identifier_nonce_unique`;');
    this.addSql('alter table `eth_nonce` add unique `eth_nonce_key_identifier_unique`(`key_identifier`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `eth_nonce` drop index `eth_nonce_key_identifier_unique`;');
    this.addSql('alter table `eth_nonce` add unique `eth_nonce_key_identifier_nonce_unique`(`key_identifier`, `nonce`);');
  }

}

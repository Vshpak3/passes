import { Migration } from '@mikro-orm/migrations';

export class Migration20221007213634 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `eth_nonce` (`id` varchar(36) not null default (UUID()), `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, `key_identifier` varchar(100) not null, `nonce` int not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `eth_nonce` add unique `eth_nonce_key_identifier_nonce_unique`(`key_identifier`, `nonce`);');
  }

}

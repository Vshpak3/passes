import { Migration } from '@mikro-orm/migrations';

export class Migration20221115204737 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `message` add `payer_id` varchar(36) null;');
    this.addSql('alter table `message` add constraint `message_payer_id_foreign` foreign key (`payer_id`) references `users` (`id`) on update cascade on delete set null;');
    this.addSql('alter table `message` add index `message_payer_id_index`(`payer_id`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `message` drop foreign key `message_payer_id_foreign`;');

    this.addSql('alter table `message` drop index `message_payer_id_index`;');
  }

}

import { Migration } from '@mikro-orm/migrations'

export class Migration20221004171922 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `whitelisted_users` (`id` varchar(36) not null default (UUID()), `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, `email` varchar(255) not null, `pass_id` varchar(36) not null, `created` tinyint(1) not null default false, primary key (`id`)) default character set utf8mb4 engine = InnoDB;',
    )
    this.addSql(
      'alter table `whitelisted_users` add index `whitelisted_users_pass_id_index`(`pass_id`);',
    )
    this.addSql(
      'alter table `whitelisted_users` add unique `whitelisted_users_email_pass_id_unique`(`email`, `pass_id`);',
    )

    this.addSql(
      'alter table `whitelisted_users` add constraint `whitelisted_users_pass_id_foreign` foreign key (`pass_id`) references `pass` (`id`) on update cascade;',
    )
  }
}

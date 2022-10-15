import { Migration } from '@mikro-orm/migrations'

export class Migration20221015004648 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "create table `scheduled_event` (`id` varchar(36) not null default (UUID()), `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, `user_id` varchar(36) not null, `type` enum('create_post', 'send_message', 'batch_message') not null, `body` json not null, `scheduled_at` datetime not null, `deleted_at` datetime null, `processor` varchar(36) null, `processed` tinyint(1) not null default false, primary key (`id`)) default character set utf8mb4 engine = InnoDB;",
    )
    this.addSql(
      'alter table `scheduled_event` add index `scheduled_event_user_id_index`(`user_id`);',
    )
    this.addSql(
      'alter table `scheduled_event` add unique `scheduled_event_processor_unique`(`processor`);',
    )

    this.addSql(
      'alter table `scheduled_event` add constraint `scheduled_event_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
    )

    this.addSql('alter table `post` drop index `post_scheduled_at_index`;')
  }

  async down(): Promise<void> {
    this.addSql('alter table `post` add `scheduled_at` datetime null;')
    this.addSql(
      'alter table `post` add index `post_scheduled_at_index`(`scheduled_at`);',
    )
  }
}

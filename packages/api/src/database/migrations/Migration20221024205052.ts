import { Migration } from '@mikro-orm/migrations';

export class Migration20221024205052 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user_spending` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `creator_id` varchar(36) not null, `amount` int not null default 0, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user_spending` add index `user_spending_user_id_index`(`user_id`);');
    this.addSql('alter table `user_spending` add index `user_spending_creator_id_index`(`creator_id`);');
    this.addSql('alter table `user_spending` add unique `user_spending_user_id_creator_id_unique`(`user_id`, `creator_id`);');

    this.addSql('alter table `user_spending` add constraint `user_spending_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `user_spending` add constraint `user_spending_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade;');

    this.addSql('drop table if exists `follow_report`;');

    this.addSql('drop table if exists `post_content`;');

    this.addSql('drop table if exists `post_pass_holder_access`;');

    this.addSql('alter table `post_tip` drop foreign key `post_tip_payin_id_foreign`;');
    this.addSql('alter table `post` drop `scheduled_at`;');
    this.addSql('alter table `post_tip` drop index `post_tip_payin_id_unique`;');
    this.addSql('alter table `post_tip` drop index `post_tip_post_id_user_id_index`;');
    this.addSql('alter table `post_tip` drop `payin_id`;');
    this.addSql('alter table `post_tip` add unique `post_tip_post_id_user_id_unique`(`post_id`, `user_id`);');
    this.addSql('alter table `paid_message` drop `content_ids`;');
    this.addSql('alter table `paid_message` drop `paid`;');
    this.addSql('alter table `message` drop `content_ids`;');

    this.addSql('alter table `list` modify `id` varchar(36) not null default (UUID()), modify `type` enum(\'normal\', \'followers\', \'following\', \'top spenders\') not null default \'normal\';');

    this.addSql('alter table `list_member` add `meta_number` int null;')
    this.addSql('alter table `payin` drop `converted_amoun`;');
    this.addSql('alter table `pass_holder` drop `ignored`;');
  }

  async down(): Promise<void> {
    this.addSql('create table `follow_report` (`id` varchar(36) not null default \'uuid()\', `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, `follower_id` varchar(36) not null, `creator_id` varchar(36) not null, `reason` varchar(250) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `follow_report` add index `follow_report_follower_id_index`(`follower_id`);');
    this.addSql('alter table `follow_report` add index `follow_report_creator_id_index`(`creator_id`);');
    this.addSql('alter table `follow_report` add index `follow_report_created_at_index`(`created_at`);');

    this.addSql('create table `post_content` (`id` varchar(36) not null default \'uuid()\', `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `post_id` varchar(36) not null, `content_id` varchar(36) not null, `index` int not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_content` add index `post_content_post_id_index`(`post_id`);');
    this.addSql('alter table `post_content` add index `post_content_content_id_index`(`content_id`);');

    this.addSql('create table `post_pass_holder_access` (`id` varchar(36) not null default \'uuid()\', `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, `post_user_access_id` varchar(36) not null, `pass_holder_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_pass_holder_access` add unique `post_pass_holder_access_post_user_access_id_pass_h_6a000_unique`(`post_user_access_id`, `pass_holder_id`);');
    this.addSql('alter table `post_pass_holder_access` add index `post_pass_holder_access_post_user_access_id_index`(`post_user_access_id`);');
    this.addSql('alter table `post_pass_holder_access` add index `post_pass_holder_access_pass_holder_id_index`(`pass_holder_id`);');

    this.addSql('alter table `follow_report` add constraint `follow_report_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade on delete no action;');
    this.addSql('alter table `follow_report` add constraint `follow_report_follower_id_foreign` foreign key (`follower_id`) references `users` (`id`) on update cascade on delete no action;');

    this.addSql('alter table `post_content` add constraint `post_content_content_id_foreign` foreign key (`content_id`) references `content` (`id`) on update cascade on delete no action;');
    this.addSql('alter table `post_content` add constraint `post_content_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade on delete no action;');

    this.addSql('alter table `post_pass_holder_access` add constraint `post_pass_holder_access_pass_holder_id_foreign` foreign key (`pass_holder_id`) references `pass_holder` (`id`) on update cascade on delete no action;');
    this.addSql('alter table `post_pass_holder_access` add constraint `post_pass_holder_access_post_user_access_id_foreign` foreign key (`post_user_access_id`) references `post_user_access` (`id`) on update cascade on delete no action;');

    this.addSql('drop table if exists `user_spending`;');

    this.addSql('alter table `channel_member` modify `id` varchar(36) not null default \'uuid()\', modify `tip_sent` decimal(12,2) not null default 0.00, modify `tip_received` decimal(12,2) not null default 0.00, modify `unread_tip` decimal(12,2) not null default 0.00;');

    this.addSql('alter table `creator_settings` modify `id` varchar(36) not null default \'uuid()\', modify `minimum_tip_amount` decimal(12,2) default 3.00;');

    this.addSql('alter table `list` modify `id` varchar(36) not null default \'uuid()\', modify `type` enum(\'normal\', \'followers\', \'following\') not null default \'normal\';');
    this.addSql('alter table `list_member` drop `meta_number`;');

    this.addSql('alter table `message` add `content_ids` varchar(500) not null default \'[]\';');
    this.addSql('alter table `message` modify `id` varchar(36) not null default \'uuid()\', modify `price` decimal(12,2) not null default 0.00;');

    this.addSql('alter table `paid_message` add `content_ids` varchar(500) not null default \'[]\', add `paid` int not null default 0;');
    this.addSql('alter table `paid_message` modify `id` varchar(36) not null default \'uuid()\', modify `earnings_purchases` decimal(12,2) not null default 0.00;');

    this.addSql('alter table `pass` modify `id` varchar(36) not null default \'uuid()\', modify `price` decimal(12,2) not null default 0.00;');

    this.addSql('alter table `pass_holder` add `ignored` tinyint(1) not null default 0;')

    this.addSql('alter table `payin` add `converted_amoun` float null;')

    this.addSql('alter table `post` add `scheduled_at` datetime null;');
    this.addSql('alter table `post` modify `id` varchar(36) not null default \'uuid()\', modify `earnings_purchases` decimal(12,2) not null default 0.00, modify `price` decimal(12,2) not null default 0.00, modify `total_tip_amount` decimal(12,2) not null default 0.00;');

    this.addSql('alter table `post_tip` add `payin_id` varchar(36) not null;')
    this.addSql('alter table `post_tip` drop index `post_tip_post_id_user_id_unique`;');
    this.addSql('alter table `post_tip` add constraint `post_tip_payin_id_foreign` foreign key (`payin_id`) references `payin` (`id`) on update cascade on delete no action;');
    this.addSql('alter table `post_tip` add unique `post_tip_payin_id_unique`(`payin_id`);');
    this.addSql('alter table `post_tip` add index `post_tip_post_id_user_id_index`(`post_id`, `user_id`);');
  }

}

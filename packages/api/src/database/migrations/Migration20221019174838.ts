import { Migration } from '@mikro-orm/migrations';

export class Migration20221019174838 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `channel` modify `id` varchar(36) not null default (UUID()), modify `recent` datetime(3);');

    this.addSql('alter table `circle_notification` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `eth_nonce` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `facebook_deletion_request` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `users` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `scheduled_event` modify `id` varchar(36) not null default (UUID()), modify `scheduled_at` datetime(3) not null, modify `deleted_at` datetime(3);');

    this.addSql('alter table `report` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `profile` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `post` add `content_processed` tinyint(1) not null default false;');
    this.addSql('alter table `post` modify `id` varchar(36) not null default (UUID()), modify `earnings_purchases` decimal(12, 2) not null default 0, modify `deleted_at` datetime(3), modify `price` decimal(12, 2) not null default 0, modify `expires_at` datetime(3), modify `pinned_at` datetime(3), modify `total_tip_amount` decimal(12, 2) not null default 0;');

    this.addSql('alter table `post_like` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `post_history` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `persona_inquiry` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `persona_verification` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `pass` modify `id` varchar(36) not null default (UUID()), modify `title` varchar(50) not null, modify `price` decimal(12, 2) not null default 0, modify `pinned_at` datetime(3);');

    this.addSql('alter table `post_pass_access` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `pass_purchase` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `paid_message` modify `id` varchar(36) not null default (UUID()), modify `earnings_purchases` decimal(12, 2) not null default 0;');

    this.addSql('alter table `paid_message_history` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `notification_settings` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `notification` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `message` modify `id` varchar(36) not null default (UUID()), modify `price` decimal(12, 2) not null default 0;');

    this.addSql('alter table `list` modify `id` varchar(36) not null default (UUID()), modify `deleted_at` datetime(3);');

    this.addSql('alter table `list_member` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `follow` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `follow_block` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `fan_wall_comment` modify `id` varchar(36) not null default (UUID()), modify `deleted_at` datetime(3);');

    this.addSql('alter table `creator_verification` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `creator_stat` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `creator_settings` modify `id` varchar(36) not null default (UUID()), modify `minimum_tip_amount` decimal(12, 2) default 3;');

    this.addSql('alter table `creator_fee` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `creator_earning_history` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `creator_earning` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `content` add `processed` tinyint(1) not null default false;');
    this.addSql('alter table `content` modify `id` varchar(36) not null default (UUID()), modify `deleted_at` datetime(3);');

    this.addSql('alter table `comment` modify `id` varchar(36) not null default (UUID()), modify `deleted_at` datetime(3);');

    this.addSql('alter table `circle_card` modify `id` varchar(36) not null default (UUID()), modify `deleted_at` datetime(3);');

    this.addSql('alter table `payin` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `post_user_access` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `post_tip` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `creator_share` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `default_payin_method` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `circle_payment` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `circle_chargeback` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `circle_bank` modify `id` varchar(36) not null default (UUID()), modify `deleted_at` datetime(3);');

    this.addSql('alter table `channel_member` modify `id` varchar(36) not null default (UUID()), modify `tip_sent` decimal(12, 2) not null default 0, modify `tip_received` decimal(12, 2) not null default 0, modify `unread_tip` decimal(12, 2) not null default 0;');

    this.addSql('alter table `block_task` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `auth` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `reset_password_request` modify `id` varchar(36) not null default (UUID()), modify `used_at` datetime(3);');

    this.addSql('alter table `user_external_pass` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `user_message_content` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `verify_email_request` modify `id` varchar(36) not null default (UUID()), modify `used_at` datetime(3);');

    this.addSql('alter table `wallet` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `payout` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `circle_transfer` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `circle_payout` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `pass_holder` modify `id` varchar(36) not null default (UUID()), modify `expires_at` datetime(3);');

    this.addSql('alter table `subscription` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `default_wallet` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `default_payout_method` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `welcome_messaged` modify `id` varchar(36) not null default (UUID());');

    this.addSql('alter table `whitelisted_users` modify `id` varchar(36) not null default (UUID());');
  }

  async down(): Promise<void> {
    this.addSql('create table `follow_report` (`id` varchar(36) not null default \'uuid()\', `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, `follower_id` varchar(36) not null, `creator_id` varchar(36) not null, `reason` varchar(250) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `follow_report` add index `follow_report_follower_id_index`(`follower_id`);');
    this.addSql('alter table `follow_report` add index `follow_report_creator_id_index`(`creator_id`);');
    this.addSql('alter table `follow_report` add index `follow_report_created_at_index`(`created_at`);');

    this.addSql('create table `post_content` (`id` varchar(36) not null default \'uuid()\', `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, `post_id` varchar(36) not null, `content_id` varchar(36) not null, `index` int not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_content` add unique `post_content_post_id_content_id_index_unique`(`post_id`, `content_id`, `index`);');
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

    this.addSql('alter table `auth` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `block_task` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `channel` modify `id` varchar(36) not null default \'uuid()\', modify `recent` datetime;');

    this.addSql('alter table `channel_member` modify `id` varchar(36) not null default \'uuid()\', modify `tip_sent` decimal(12,2) not null default 0.00, modify `tip_received` decimal(12,2) not null default 0.00, modify `unread_tip` decimal(12,2) not null default 0.00;');

    this.addSql('alter table `circle_bank` modify `id` varchar(36) not null default \'uuid()\', modify `deleted_at` datetime;');

    this.addSql('alter table `circle_card` modify `id` varchar(36) not null default \'uuid()\', modify `deleted_at` datetime;');

    this.addSql('alter table `circle_chargeback` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `circle_notification` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `circle_payment` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `circle_payout` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `circle_transfer` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `comment` modify `id` varchar(36) not null default \'uuid()\', modify `deleted_at` datetime;');

    this.addSql('alter table `content` modify `id` varchar(36) not null default \'uuid()\', modify `deleted_at` datetime;');

    this.addSql('alter table `creator_earning` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `creator_earning_history` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `creator_fee` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `creator_settings` modify `id` varchar(36) not null default \'uuid()\', modify `minimum_tip_amount` decimal(12,2) default 3.00;');

    this.addSql('alter table `creator_share` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `creator_stat` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `creator_verification` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `default_payin_method` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `default_payout_method` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `default_wallet` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `eth_nonce` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `facebook_deletion_request` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `fan_wall_comment` modify `id` varchar(36) not null default \'uuid()\', modify `deleted_at` datetime;');

    this.addSql('alter table `follow` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `follow_block` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `list` modify `id` varchar(36) not null default \'uuid()\', modify `deleted_at` datetime;');

    this.addSql('alter table `list_member` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `message` add `content_ids` varchar(500) not null default \'[]\';');
    this.addSql('alter table `message` modify `id` varchar(36) not null default \'uuid()\', modify `price` decimal(12,2) not null default 0.00;');

    this.addSql('alter table `notification` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `notification_settings` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `paid_message` add `content_ids` varchar(500) not null default \'[]\', add `paid` int not null default 0;');
    this.addSql('alter table `paid_message` modify `id` varchar(36) not null default \'uuid()\', modify `earnings_purchases` decimal(12,2) not null default 0.00;');

    this.addSql('alter table `paid_message_history` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `pass` modify `id` varchar(36) not null default \'uuid()\', modify `title` varchar(100) not null, modify `price` decimal(12,2) not null default 0.00, modify `pinned_at` datetime;');

    this.addSql('alter table `pass_holder` add `ignored` tinyint(1) not null default 0;');
    this.addSql('alter table `pass_holder` modify `id` varchar(36) not null default \'uuid()\', modify `expires_at` datetime;');

    this.addSql('alter table `pass_purchase` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `payin` add `converted_amoun` float null;');
    this.addSql('alter table `payin` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `payout` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `persona_inquiry` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `persona_verification` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `post` add `scheduled_at` datetime null;');
    this.addSql('alter table `post` modify `id` varchar(36) not null default \'uuid()\', modify `earnings_purchases` decimal(12,2) not null default 0.00, modify `deleted_at` datetime, modify `price` decimal(12,2) not null default 0.00, modify `expires_at` datetime, modify `pinned_at` datetime, modify `total_tip_amount` decimal(12,2) not null default 0.00;');

    this.addSql('alter table `post_history` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `post_like` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `post_pass_access` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `post_tip` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `post_user_access` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `profile` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `report` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `reset_password_request` modify `id` varchar(36) not null default \'uuid()\', modify `used_at` datetime;');

    this.addSql('alter table `scheduled_event` modify `id` varchar(36) not null default \'uuid()\', modify `scheduled_at` datetime not null, modify `deleted_at` datetime;');

    this.addSql('alter table `subscription` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `user_external_pass` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `user_message_content` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `users` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `verify_email_request` modify `id` varchar(36) not null default \'uuid()\', modify `used_at` datetime;');

    this.addSql('alter table `wallet` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `welcome_messaged` modify `id` varchar(36) not null default \'uuid()\';');

    this.addSql('alter table `whitelisted_users` modify `id` varchar(36) not null default \'uuid()\';');
  }

}

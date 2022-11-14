import { Migration } from '@mikro-orm/migrations';

export class Migration20221114025428 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `channel` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `recent` datetime(3) null, `preview_text` varchar(10000) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `channel` add index `channel_recent_index`(`recent`);');

    this.addSql('create table `circle_notification` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `client_id` varchar(36) not null, `notification_type` varchar(50) not null, `full_content` text not null, `processed` tinyint(1) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `eth_nonce` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `key_identifier` varchar(100) not null, `nonce` int not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `eth_nonce` add unique `eth_nonce_key_identifier_unique`(`key_identifier`);');

    this.addSql('create table `facebook_deletion_request` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `facebook_user_id` varchar(64) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `users` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `email` varchar(255) not null, `username` varchar(30) not null, `legal_full_name` varchar(50) not null, `country_code` varchar(3) not null, `birthday` date not null, `display_name` varchar(50) not null, `phone_number` varchar(30) null, `is_kyc_verified` tinyint(1) not null default false, `is_creator` tinyint(1) not null default false, `is_active` tinyint(1) not null default true, `is_adult` tinyint(1) not null default false, `num_following` int not null default 0, `payment_blocked` tinyint(1) not null default false, `chargeback_count` int not null default 0, `featured` tinyint(1) not null default false, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `users` add unique `users_email_unique`(`email`);');
    this.addSql('alter table `users` add unique `users_username_unique`(`username`);');
    this.addSql('alter table `users` add index `users_display_name_index`(`display_name`);');

    this.addSql('create table `scheduled_event` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `type` enum(\'create_post\', \'send_message\', \'batch_message\') not null, `body` json not null, `scheduled_at` datetime(3) not null, `deleted_at` datetime(3) null, `processor` varchar(36) null, `processed` tinyint(1) not null default false, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `scheduled_event` add index `scheduled_event_user_id_index`(`user_id`);');
    this.addSql('alter table `scheduled_event` add index `scheduled_event_scheduled_at_index`(`scheduled_at`);');
    this.addSql('alter table `scheduled_event` add unique `scheduled_event_processor_unique`(`processor`);');

    this.addSql('create table `report` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `reporter_id` varchar(36) not null, `reportee_id` varchar(36) not null, `reason` varchar(250) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `report` add index `report_reporter_id_index`(`reporter_id`);');
    this.addSql('alter table `report` add index `report_reportee_id_index`(`reportee_id`);');
    this.addSql('alter table `report` add index `report_created_at_index`(`created_at`);');

    this.addSql('create table `profile` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `cover_title` varchar(250) null, `cover_description` text null, `description` text null, `discord_username` varchar(150) null, `facebook_username` varchar(150) null, `instagram_username` varchar(150) null, `tiktok_username` varchar(150) null, `twitch_username` varchar(150) null, `twitter_username` varchar(150) null, `youtube_username` varchar(150) null, `is_active` tinyint(1) not null default true, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `profile` add unique `profile_user_id_unique`(`user_id`);');

    this.addSql('create table `post` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `text` text not null, `tags` varchar(350) not null default \'[]\', `contents` varchar(5000) not null default \'[]\', `preview_index` int not null default 0, `num_likes` int not null default 0, `num_comments` int not null default 0, `num_purchases` int not null default 0, `earnings_purchases` decimal(12, 2) not null default 0, `deleted_at` datetime(3) null, `hidden_at` datetime(3) null, `price` decimal(12, 2) not null default 0, `expires_at` datetime(3) null, `pinned_at` datetime(3) null, `total_tip_amount` decimal(12, 2) not null default 0, `pass_ids` varchar(3000) not null default \'[]\', `content_processed` tinyint(1) not null default false, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post` add index `post_user_id_index`(`user_id`);');
    this.addSql('alter table `post` add index `post_num_likes_index`(`num_likes`);');
    this.addSql('alter table `post` add index `post_num_comments_index`(`num_comments`);');
    this.addSql('alter table `post` add index `post_num_purchases_index`(`num_purchases`);');
    this.addSql('alter table `post` add index `post_earnings_purchases_index`(`earnings_purchases`);');
    this.addSql('alter table `post` add index `post_expires_at_index`(`expires_at`);');
    this.addSql('alter table `post` add index `post_pinned_at_index`(`pinned_at`);');
    this.addSql('alter table `post` add index `post_total_tip_amount_index`(`total_tip_amount`);');

    this.addSql('create table `post_tip` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `post_id` varchar(36) not null, `amount` decimal(12, 2) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_tip` add index `post_tip_user_id_index`(`user_id`);');
    this.addSql('alter table `post_tip` add index `post_tip_post_id_index`(`post_id`);');
    this.addSql('alter table `post_tip` add index `post_tip_amount_index`(`amount`);');
    this.addSql('alter table `post_tip` add unique `post_tip_post_id_user_id_unique`(`post_id`, `user_id`);');

    this.addSql('create table `post_like` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `post_id` varchar(36) not null, `liker_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_like` add index `post_like_post_id_index`(`post_id`);');
    this.addSql('alter table `post_like` add index `post_like_liker_id_index`(`liker_id`);');
    this.addSql('alter table `post_like` add index `post_like_created_at_index`(`created_at`);');
    this.addSql('alter table `post_like` add unique `post_like_post_id_liker_id_unique`(`post_id`, `liker_id`);');

    this.addSql('create table `post_history` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `post_id` varchar(36) not null, `num_likes` int not null, `num_comments` int not null, `num_purchases` int not null, `earnings_purchases` decimal(12, 2) not null, `total_tip_amount` decimal(12, 2) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_history` add index `post_history_post_id_index`(`post_id`);');
    this.addSql('alter table `post_history` add index `post_history_created_at_index`(`created_at`);');

    this.addSql('create table `post_category` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `name` varchar(25) not null, `count` int not null default 0, `order` int not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_category` add index `post_category_user_id_index`(`user_id`);');
    this.addSql('alter table `post_category` add unique `post_category_name_user_id_unique`(`name`, `user_id`);');

    this.addSql('create table `post_to_category` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `post_category_id` varchar(36) not null, `post_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_to_category` add index `post_to_category_post_category_id_index`(`post_category_id`);');
    this.addSql('alter table `post_to_category` add index `post_to_category_post_id_index`(`post_id`);');
    this.addSql('alter table `post_to_category` add unique `post_to_category_post_category_id_post_id_unique`(`post_category_id`, `post_id`);');

    this.addSql('create table `persona_inquiry` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `persona_id` varchar(28) not null, `persona_status` enum(\'created\', \'pending\', \'completed\', \'failed\', \'expired\', \'needs_review\', \'approved\', \'declined\') not null, `kyc_status` enum(\'pending\', \'completed\', \'failed\') not null default \'pending\', primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `persona_inquiry` add index `persona_inquiry_user_id_index`(`user_id`);');
    this.addSql('alter table `persona_inquiry` add unique `persona_inquiry_persona_id_unique`(`persona_id`);');

    this.addSql('create table `persona_verification` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `inquiry_id` varchar(36) not null, `persona_id` varchar(28) not null, `persona_status` enum(\'created\', \'confirmed\', \'submitted\', \'passed\', \'failed\', \'requires_retry\', \'cancelled\') not null default \'created\', primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `persona_verification` add index `persona_verification_inquiry_id_index`(`inquiry_id`);');
    this.addSql('alter table `persona_verification` add unique `persona_verification_persona_id_unique`(`persona_id`);');

    this.addSql('create table `pass` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `creator_id` varchar(36) null, `title` varchar(50) not null, `description` varchar(500) not null, `symbol` varchar(5) not null, `type` enum(\'subscription\', \'lifetime\', \'external\') not null, `price` decimal(12, 2) not null default 0, `eth_price` decimal(50, 0) null, `duration` bigint null, `freetrial` tinyint(1) not null default false, `pinned_at` datetime(3) null, `total_supply` int null, `remaining_supply` int null, `messages` int null default 0, `collection_address` varchar(64) null, `minted` tinyint(1) not null default false, `chain` enum(\'eth\', \'sol\', \'avax\', \'matic\') not null, `royalties` int not null default 0, `animation_type` enum(\'mp4\', \'mov\') null, `image_type` enum(\'jpeg\', \'png\', \'gif\') not null default \'png\', `access_type` enum(\'pass_access\', \'account_access\') not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `pass` add index `pass_creator_id_index`(`creator_id`);');
    this.addSql('alter table `pass` add index `pass_pinned_at_index`(`pinned_at`);');
    this.addSql('alter table `pass` add unique `pass_creator_id_title_unique`(`creator_id`, `title`);');

    this.addSql('create table `post_pass_access` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `post_id` varchar(36) not null, `pass_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_pass_access` add index `post_pass_access_post_id_index`(`post_id`);');
    this.addSql('alter table `post_pass_access` add index `post_pass_access_pass_id_index`(`pass_id`);');
    this.addSql('alter table `post_pass_access` add unique `post_pass_access_post_id_pass_id_unique`(`post_id`, `pass_id`);');

    this.addSql('create table `pass_purchase` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `pass_id` varchar(36) not null, `user_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `pass_purchase` add index `pass_purchase_pass_id_index`(`pass_id`);');
    this.addSql('alter table `pass_purchase` add index `pass_purchase_user_id_index`(`user_id`);');
    this.addSql('alter table `pass_purchase` add unique `pass_purchase_pass_id_user_id_unique`(`pass_id`, `user_id`);');

    this.addSql('create table `paid_message` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `creator_id` varchar(36) not null, `text` text not null, `price` decimal(12, 2) not null, `contents` varchar(5000) not null default \'[]\', `preview_index` int not null default 0, `num_purchases` int not null default 0, `earnings_purchases` decimal(12, 2) not null default 0, `sent_to` int not null default 0, `viewed` int not null default 0, `unsent_at` datetime(3) null, `hidden_at` datetime(3) null, `is_welcome_message` tinyint(1) not null default false, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `paid_message` add index `paid_message_creator_id_index`(`creator_id`);');
    this.addSql('alter table `paid_message` add index `paid_message_created_at_index`(`created_at`);');

    this.addSql('create table `paid_message_history` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `paid_message_id` varchar(36) not null, `num_purchases` int not null, `earnings_purchases` decimal(12, 2) not null, `sent_to` int not null default 0, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `paid_message_history` add index `paid_message_history_paid_message_id_index`(`paid_message_id`);');
    this.addSql('alter table `paid_message_history` add index `paid_message_history_created_at_index`(`created_at`);');

    this.addSql('create table `notification_settings` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `direct_message_emails` tinyint(1) not null default true, `passes_emails` tinyint(1) not null default true, `payment_emails` tinyint(1) not null default true, `post_emails` tinyint(1) not null default true, `marketing_emails` tinyint(1) not null default true, `mention_emails` tinyint(1) not null default true, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `notification_settings` add unique `notification_settings_user_id_unique`(`user_id`);');

    this.addSql('create table `notification` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `sender_id` varchar(36) null, `message` varchar(200) not null, `type` enum(\'comment\', \'mention\', \'subscription\', \'payment\', \'other\') not null, `status` enum(\'unread\', \'read\') not null default \'unread\', primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `notification` add index `notification_user_id_index`(`user_id`);');
    this.addSql('alter table `notification` add index `notification_sender_id_index`(`sender_id`);');

    this.addSql('create table `message` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `sender_id` varchar(36) not null, `text` text not null, `contents` varchar(5000) not null default \'[]\', `preview_index` int not null default 0, `has_content` tinyint(1) not null, `channel_id` varchar(36) not null, `tip_amount` int not null, `pending` tinyint(1) not null, `paid_at` datetime null, `paying` tinyint(1) not null default false, `price` decimal(12, 2) not null default 0, `reverted` tinyint(1) not null default false, `reply_id` varchar(36) null, `paid_message_id` varchar(36) null, `sent_at` datetime(3) not null default current_timestamp(3), `content_processed` tinyint(1) not null default false, `deleted_at` datetime(3) null, `automatic` tinyint(1) not null default false, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `message` add index `message_sender_id_index`(`sender_id`);');
    this.addSql('alter table `message` add index `message_channel_id_index`(`channel_id`);');
    this.addSql('alter table `message` add index `message_reply_id_index`(`reply_id`);');
    this.addSql('alter table `message` add index `message_paid_message_id_index`(`paid_message_id`);');
    this.addSql('alter table `message` add index `message_sent_at_index`(`sent_at`);');
    this.addSql('alter table `message` add index `message_created_at_index`(`created_at`);');

    this.addSql('create table `list` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `name` varchar(50) null, `type` enum(\'normal\', \'followers\', \'following\', \'top spenders\') not null default \'normal\', `count` int not null default 0, `deleted_at` datetime(3) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `list` add index `list_user_id_index`(`user_id`);');
    this.addSql('alter table `list` add index `list_created_at_index`(`created_at`);');
    this.addSql('alter table `list` add unique `list_name_user_id_unique`(`name`, `user_id`);');

    this.addSql('create table `list_member` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `list_id` varchar(36) not null, `user_id` varchar(36) not null, `meta_number` int null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `list_member` add index `list_member_list_id_index`(`list_id`);');
    this.addSql('alter table `list_member` add index `list_member_user_id_index`(`user_id`);');
    this.addSql('alter table `list_member` add index `list_member_created_at_index`(`created_at`);');
    this.addSql('alter table `list_member` add unique `list_member_list_id_user_id_unique`(`list_id`, `user_id`);');

    this.addSql('create table `follow` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `follower_id` varchar(36) not null, `creator_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `follow` add index `follow_follower_id_index`(`follower_id`);');
    this.addSql('alter table `follow` add index `follow_creator_id_index`(`creator_id`);');
    this.addSql('alter table `follow` add index `follow_created_at_index`(`created_at`);');
    this.addSql('alter table `follow` add unique `follow_follower_id_creator_id_unique`(`follower_id`, `creator_id`);');

    this.addSql('create table `follow_block` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `follower_id` varchar(36) not null, `creator_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `follow_block` add index `follow_block_follower_id_index`(`follower_id`);');
    this.addSql('alter table `follow_block` add index `follow_block_creator_id_index`(`creator_id`);');
    this.addSql('alter table `follow_block` add index `follow_block_created_at_index`(`created_at`);');
    this.addSql('alter table `follow_block` add unique `follow_block_follower_id_creator_id_unique`(`follower_id`, `creator_id`);');

    this.addSql('create table `fan_wall_comment` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `creator_id` varchar(36) not null, `commenter_id` varchar(36) not null, `text` varchar(500) not null, `tags` varchar(350) not null default \'[]\', `hidden` tinyint(1) not null default false, `blocked` tinyint(1) not null default false, `deactivated` tinyint(1) not null default false, `deleted_at` datetime(3) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `fan_wall_comment` add index `fan_wall_comment_creator_id_index`(`creator_id`);');
    this.addSql('alter table `fan_wall_comment` add index `fan_wall_comment_commenter_id_index`(`commenter_id`);');
    this.addSql('alter table `fan_wall_comment` add index `fan_wall_comment_created_at_index`(`created_at`);');

    this.addSql('create table `creator_verification` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `step` enum(\'step 1 profile\', \'step 2 KYC\', \'step 3 payout\', \'step 4 done\') not null default \'step 1 profile\', primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `creator_verification` add unique `creator_verification_user_id_unique`(`user_id`);');

    this.addSql('create table `creator_stat` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `num_followers` int not null default 0, `num_likes` int not null default 0, `num_posts` int not null default 0, `num_media` int not null default 0, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `creator_stat` add unique `creator_stat_user_id_unique`(`user_id`);');

    this.addSql('create table `creator_settings` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `minimum_tip_amount` decimal(12, 2) null default 3, `welcome_message` tinyint(1) not null default false, `allow_comments_on_posts` tinyint(1) not null default true, `payout_frequency` enum(\'manual\', \'two weeks\', \'four weeks\', \'one week\') not null default \'manual\', `show_follower_count` tinyint(1) not null default true, `show_media_count` tinyint(1) not null default true, `show_like_count` tinyint(1) not null default true, `show_post_count` tinyint(1) not null default true, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `creator_settings` add unique `creator_settings_user_id_unique`(`user_id`);');

    this.addSql('create table `creator_fee` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `creator_id` varchar(36) not null, `fiat_rate` float null, `fiat_flat` decimal(12, 2) null, `crypto_rate` float null, `crypto_flat` decimal(12, 2) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `creator_fee` add unique `creator_fee_creator_id_unique`(`creator_id`);');

    this.addSql('create table `creator_earning_history` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `amount` decimal(12, 2) not null, `type` enum(\'available_balance\', \'total\', \'subscription\', \'tips\', \'posts\', \'messages\', \'lifetime\', \'other\', \'chargebacks\') not null, `category` enum(\'net\', \'gross\', \'agency\') not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `creator_earning_history` add index `creator_earning_history_user_id_index`(`user_id`);');
    this.addSql('alter table `creator_earning_history` add index `creator_earning_history_created_at_index`(`created_at`);');

    this.addSql('create table `creator_earning` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `amount` decimal(12, 2) not null, `type` enum(\'available_balance\', \'total\', \'subscription\', \'tips\', \'posts\', \'messages\', \'lifetime\', \'other\', \'chargebacks\') not null, `category` enum(\'net\', \'gross\', \'agency\') not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `creator_earning` add index `creator_earning_user_id_index`(`user_id`);');
    this.addSql('alter table `creator_earning` add unique `creator_earning_user_id_type_category_unique`(`user_id`, `type`, `category`);');

    this.addSql('create table `content` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `content_type` enum(\'image\', \'video\', \'gif\', \'audio\') not null, `in_message` tinyint(1) not null default false, `in_post` tinyint(1) not null default false, `deleted_at` datetime(3) null, `processed` tinyint(1) not null default false, `failed` tinyint(1) not null default false, `uploaded` tinyint(1) not null default false, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `content` add index `content_user_id_index`(`user_id`);');

    this.addSql('create table `comment` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `post_id` varchar(36) not null, `commenter_id` varchar(36) not null, `text` varchar(200) not null, `tags` varchar(350) not null default \'[]\', `hidden` tinyint(1) not null default false, `blocked` tinyint(1) not null default false, `deactivated` tinyint(1) not null default false, `deleted_at` datetime(3) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `comment` add index `comment_post_id_index`(`post_id`);');
    this.addSql('alter table `comment` add index `comment_commenter_id_index`(`commenter_id`);');

    this.addSql('create table `circle_card` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `idempotency_key` varchar(36) not null, `circle_id` varchar(36) null, `status` enum(\'pending\', \'complete\', \'failed\') not null, `card_number` varchar(36) not null, `exp_month` int not null, `exp_year` int not null, `name` varchar(50) not null, `deleted_at` datetime(3) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `circle_card` add index `circle_card_user_id_index`(`user_id`);');
    this.addSql('alter table `circle_card` add unique `circle_card_idempotency_key_unique`(`idempotency_key`);');
    this.addSql('alter table `circle_card` add unique `circle_card_circle_id_unique`(`circle_id`);');

    this.addSql('create table `payin` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `payin_method` enum(\'none\', \'circle_card\', \'phantom_circle_usdc\', \'metamask_circle_usdc\', \'metamask_circle_eth\') not null, `card_id` varchar(36) null, `chain_id` int null, `address` varchar(64) null, `transaction_hash` varchar(88) null, `amount` decimal(12, 2) not null, `amount_eth` decimal(50, 0) null, `payin_status` enum(\'registered\', \'created_ready\', \'created\', \'uncreated_ready\', \'uncreated\', \'pending\', \'successful_ready\', \'successful\', \'failed_ready\', \'failed\', \'unregistered\', \'action_required\', \'reverted\', \'fail_callback_failed\', \'success_callback_failed\', \'create_callback_failed\') not null, `callback` enum(\'tipped_message\', \'create_nft_lifetime_pass\', \'create_nft_subscription_pass\', \'rewnew_nft_pass\', \'purchase_feed_post\', \'purchase_dm_post\', \'tip_post\', \'example\') not null, `callback_input_json` json not null, `callback_output_json` json null, `redirect_url` varchar(512) null, `ip_address` varchar(39) null, `session_id` varchar(64) null, `target` varchar(64) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `payin` add index `payin_user_id_index`(`user_id`);');
    this.addSql('alter table `payin` add index `payin_card_id_index`(`card_id`);');
    this.addSql('alter table `payin` add index `payin_amount_index`(`amount`);');

    this.addSql('create table `post_user_access` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `post_id` varchar(36) not null, `user_id` varchar(36) not null, `payin_id` varchar(36) null, `paid_at` datetime null, `paying` tinyint(1) not null default false, `pass_holder_ids` varchar(500) not null default \'[]\', primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_user_access` add index `post_user_access_post_id_index`(`post_id`);');
    this.addSql('alter table `post_user_access` add index `post_user_access_user_id_index`(`user_id`);');
    this.addSql('alter table `post_user_access` add unique `post_user_access_payin_id_unique`(`payin_id`);');
    this.addSql('alter table `post_user_access` add unique `post_user_access_post_id_user_id_unique`(`post_id`, `user_id`);');

    this.addSql('create table `creator_share` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `creator_id` varchar(36) not null, `amount` decimal(12, 2) not null, `payin_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `creator_share` add index `creator_share_creator_id_index`(`creator_id`);');
    this.addSql('alter table `creator_share` add index `creator_share_payin_id_index`(`payin_id`);');

    this.addSql('create table `default_payin_method` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `method` enum(\'none\', \'circle_card\', \'phantom_circle_usdc\', \'metamask_circle_usdc\', \'metamask_circle_eth\') not null, `card_id` varchar(36) null, `chain_id` int null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `default_payin_method` add unique `default_payin_method_user_id_unique`(`user_id`);');
    this.addSql('alter table `default_payin_method` add unique `default_payin_method_card_id_unique`(`card_id`);');

    this.addSql('create table `circle_payment` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `card_id` varchar(36) not null, `payin_id` varchar(36) not null, `idempotency_key` varchar(36) null, `circle_id` varchar(36) null, `amount` varchar(13) not null, `verification` enum(\'none\', \'cvv\', \'three_d_secure\') null, `status` enum(\'unknown\', \'pending\', \'confirmed\', \'paid\', \'failed\', \'action_required\') not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `circle_payment` add index `circle_payment_card_id_index`(`card_id`);');
    this.addSql('alter table `circle_payment` add unique `circle_payment_payin_id_unique`(`payin_id`);');
    this.addSql('alter table `circle_payment` add unique `circle_payment_idempotency_key_unique`(`idempotency_key`);');
    this.addSql('alter table `circle_payment` add unique `circle_payment_circle_id_unique`(`circle_id`);');

    this.addSql('create table `circle_chargeback` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `circle_id` varchar(36) not null, `circle_payment_id` varchar(36) not null, `full_content` text not null, `disputed` tinyint(1) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `circle_chargeback` add unique `circle_chargeback_circle_id_unique`(`circle_id`);');
    this.addSql('alter table `circle_chargeback` add index `circle_chargeback_circle_payment_id_index`(`circle_payment_id`);');

    this.addSql('create table `circle_bank` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) null, `agency_id` varchar(36) null, `idempotency_key` varchar(36) not null, `circle_id` varchar(36) null, `country` varchar(2) not null, `status` enum(\'pending\', \'complete\', \'failed\') not null, `description` varchar(100) not null, `tracking_ref` varchar(10) not null, `fingerprint` varchar(36) not null, `deleted_at` datetime(3) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `circle_bank` add index `circle_bank_user_id_index`(`user_id`);');
    this.addSql('alter table `circle_bank` add unique `circle_bank_agency_id_unique`(`agency_id`);');
    this.addSql('alter table `circle_bank` add unique `circle_bank_idempotency_key_unique`(`idempotency_key`);');
    this.addSql('alter table `circle_bank` add unique `circle_bank_circle_id_unique`(`circle_id`);');

    this.addSql('create table `agency` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `name` varchar(50) not null, `email` varchar(255) not null, `bank_id` varchar(36) not null, `available_balance` decimal(12, 2) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `agency` add unique `agency_name_unique`(`name`);');
    this.addSql('alter table `agency` add unique `agency_email_unique`(`email`);');
    this.addSql('alter table `agency` add unique `agency_bank_id_unique`(`bank_id`);');

    this.addSql('create table `creator_agency` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `creator_id` varchar(36) not null, `agency_id` varchar(36) not null, `rate` float not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `creator_agency` add unique `creator_agency_creator_id_unique`(`creator_id`);');
    this.addSql('alter table `creator_agency` add index `creator_agency_agency_id_index`(`agency_id`);');

    this.addSql('create table `channel_member` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `channel_id` varchar(36) not null, `user_id` varchar(36) not null, `other_user_id` varchar(36) not null, `tip_sent` decimal(12, 2) not null default 0, `tip_received` decimal(12, 2) not null default 0, `unread_tip` decimal(12, 2) not null default 0, `unread` tinyint(1) not null default false, `read_at` datetime(3) null, `unlimited_messages` tinyint(1) not null default false, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `channel_member` add index `channel_member_channel_id_index`(`channel_id`);');
    this.addSql('alter table `channel_member` add index `channel_member_user_id_index`(`user_id`);');
    this.addSql('alter table `channel_member` add index `channel_member_other_user_id_index`(`other_user_id`);');
    this.addSql('alter table `channel_member` add index `channel_member_unread_tip_index`(`unread_tip`);');
    this.addSql('alter table `channel_member` add unique `channel_member_user_id_other_user_id_unique`(`user_id`, `other_user_id`);');
    this.addSql('alter table `channel_member` add unique `channel_member_channel_id_user_id_unique`(`channel_id`, `user_id`);');

    this.addSql('create table `block_task` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `follower_id` varchar(36) not null, `creator_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `block_task` add index `block_task_follower_id_index`(`follower_id`);');
    this.addSql('alter table `block_task` add index `block_task_creator_id_index`(`creator_id`);');
    this.addSql('alter table `block_task` add index `block_task_created_at_index`(`created_at`);');

    this.addSql('create table `auth` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `password_hash` varchar(100) null, `oauth_provider` varchar(20) null, `oauth_id` varchar(255) null, `email` varchar(255) null, `is_email_verified` tinyint(1) not null default false, `user_id` varchar(36) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `auth` add index `auth_email_index`(`email`);');
    this.addSql('alter table `auth` add index `auth_user_id_index`(`user_id`);');
    this.addSql('alter table `auth` add index `auth_oauth_id_oauth_provider_index`(`oauth_id`, `oauth_provider`);');

    this.addSql('create table `reset_password_request` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `auth_id` varchar(36) not null, `email` varchar(255) not null, `used_at` datetime(3) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `reset_password_request` add index `reset_password_request_auth_id_index`(`auth_id`);');

    this.addSql('create table `user_external_pass` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `pass_id` varchar(36) not null, `user_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user_external_pass` add index `user_external_pass_pass_id_index`(`pass_id`);');
    this.addSql('alter table `user_external_pass` add index `user_external_pass_user_id_index`(`user_id`);');
    this.addSql('alter table `user_external_pass` add unique `user_external_pass_pass_id_user_id_unique`(`pass_id`, `user_id`);');

    this.addSql('create table `user_message_content` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `content_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user_message_content` add index `user_message_content_user_id_index`(`user_id`);');
    this.addSql('alter table `user_message_content` add index `user_message_content_content_id_index`(`content_id`);');
    this.addSql('alter table `user_message_content` add index `user_message_content_user_id_content_id_index`(`user_id`, `content_id`);');

    this.addSql('create table `user_spending` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `creator_id` varchar(36) not null, `amount` int not null default 0, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user_spending` add index `user_spending_user_id_index`(`user_id`);');
    this.addSql('alter table `user_spending` add index `user_spending_creator_id_index`(`creator_id`);');
    this.addSql('alter table `user_spending` add unique `user_spending_user_id_creator_id_unique`(`user_id`, `creator_id`);');

    this.addSql('create table `verify_email_request` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `auth_id` varchar(36) not null, `email` varchar(255) not null, `used_at` datetime(3) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `verify_email_request` add index `verify_email_request_auth_id_index`(`auth_id`);');

    this.addSql('create table `wallet` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) null, `address` varchar(64) not null, `chain` enum(\'eth\', \'sol\', \'avax\', \'matic\') not null, `custodial` tinyint(1) not null default false, `authenticated` tinyint(1) not null default true, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `wallet` add index `wallet_user_id_index`(`user_id`);');
    this.addSql('alter table `wallet` add unique `wallet_chain_address_unique`(`chain`, `address`);');

    this.addSql('create table `payout` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) null, `agency_id` varchar(36) null, `bank_id` varchar(36) null, `wallet_id` varchar(36) null, `payout_method` enum(\'none\', \'circle_wire\', \'circle_usdc\') not null, `transaction_hash` varchar(88) null, `amount` decimal(12, 2) not null, `payout_status` enum(\'created\', \'pending\', \'successful\', \'failed\') not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `payout` add index `payout_user_id_index`(`user_id`);');
    this.addSql('alter table `payout` add index `payout_agency_id_index`(`agency_id`);');
    this.addSql('alter table `payout` add index `payout_bank_id_index`(`bank_id`);');
    this.addSql('alter table `payout` add index `payout_wallet_id_index`(`wallet_id`);');
    this.addSql('alter table `payout` add index `payout_amount_index`(`amount`);');

    this.addSql('create table `circle_transfer` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `payout_id` varchar(36) not null, `idempotency_key` varchar(36) null, `circle_id` varchar(36) null, `amount` varchar(13) not null, `currency` varchar(3) not null, `status` enum(\'pending\', \'complete\', \'failed\') not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `circle_transfer` add unique `circle_transfer_payout_id_unique`(`payout_id`);');
    this.addSql('alter table `circle_transfer` add unique `circle_transfer_idempotency_key_unique`(`idempotency_key`);');
    this.addSql('alter table `circle_transfer` add unique `circle_transfer_circle_id_unique`(`circle_id`);');

    this.addSql('create table `circle_payout` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `bank_id` varchar(36) not null, `payout_id` varchar(36) not null, `idempotency_key` varchar(36) null, `circle_id` varchar(36) null, `fee` varchar(13) null, `amount` varchar(13) not null, `status` enum(\'pending\', \'complete\', \'failed\') not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `circle_payout` add index `circle_payout_bank_id_index`(`bank_id`);');
    this.addSql('alter table `circle_payout` add unique `circle_payout_payout_id_unique`(`payout_id`);');
    this.addSql('alter table `circle_payout` add unique `circle_payout_idempotency_key_unique`(`idempotency_key`);');
    this.addSql('alter table `circle_payout` add unique `circle_payout_circle_id_unique`(`circle_id`);');

    this.addSql('create table `pass_holder` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `pass_id` varchar(36) not null, `holder_id` varchar(36) null, `wallet_id` varchar(36) null, `expires_at` datetime(3) null, `messages` int null default 0, `address` varchar(64) not null, `chain` enum(\'eth\', \'sol\', \'avax\', \'matic\') not null, `token_id` varchar(130) null, `animation_type` enum(\'mp4\', \'mov\') null, `image_type` enum(\'jpeg\', \'png\', \'gif\') not null default \'png\', `access_type` enum(\'pass_access\', \'account_access\') not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `pass_holder` add index `pass_holder_pass_id_index`(`pass_id`);');
    this.addSql('alter table `pass_holder` add index `pass_holder_holder_id_index`(`holder_id`);');
    this.addSql('alter table `pass_holder` add index `pass_holder_wallet_id_index`(`wallet_id`);');
    this.addSql('alter table `pass_holder` add index `pass_holder_messages_index`(`messages`);');
    this.addSql('alter table `pass_holder` add unique `pass_holder_address_chain_token_id_unique`(`address`, `chain`, `token_id`);');

    this.addSql('create table `subscription` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `subscription_status` enum(\'active\', \'expiring\', \'disabled\', \'cancelled\') not null, `payin_method` enum(\'none\', \'circle_card\', \'phantom_circle_usdc\', \'metamask_circle_usdc\', \'metamask_circle_eth\') not null, `card_id` varchar(36) null, `chain_id` int null, `amount` decimal(12, 2) not null, `ip_address` varchar(39) null, `session_id` varchar(64) null, `target` varchar(64) not null, `pass_holder_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `subscription` add index `subscription_user_id_index`(`user_id`);');
    this.addSql('alter table `subscription` add index `subscription_card_id_index`(`card_id`);');
    this.addSql('alter table `subscription` add index `subscription_amount_index`(`amount`);');
    this.addSql('alter table `subscription` add index `subscription_pass_holder_id_index`(`pass_holder_id`);');
    this.addSql('alter table `subscription` add unique `subscription_user_id_pass_holder_id_unique`(`user_id`, `pass_holder_id`);');

    this.addSql('create table `default_wallet` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `wallet_id` varchar(36) not null, `chain` enum(\'eth\', \'sol\', \'avax\', \'matic\') not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `default_wallet` add index `default_wallet_user_id_index`(`user_id`);');
    this.addSql('alter table `default_wallet` add unique `default_wallet_wallet_id_unique`(`wallet_id`);');
    this.addSql('alter table `default_wallet` add unique `default_wallet_user_id_chain_unique`(`user_id`, `chain`);');

    this.addSql('create table `default_payout_method` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `method` enum(\'none\', \'circle_wire\', \'circle_usdc\') not null, `bank_id` varchar(36) null, `wallet_id` varchar(36) null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `default_payout_method` add unique `default_payout_method_user_id_unique`(`user_id`);');
    this.addSql('alter table `default_payout_method` add unique `default_payout_method_bank_id_unique`(`bank_id`);');
    this.addSql('alter table `default_payout_method` add unique `default_payout_method_wallet_id_unique`(`wallet_id`);');

    this.addSql('create table `welcome_messaged` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `follower_id` varchar(36) not null, `creator_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `welcome_messaged` add index `welcome_messaged_follower_id_index`(`follower_id`);');
    this.addSql('alter table `welcome_messaged` add index `welcome_messaged_creator_id_index`(`creator_id`);');
    this.addSql('alter table `welcome_messaged` add unique `welcome_messaged_follower_id_creator_id_unique`(`follower_id`, `creator_id`);');

    this.addSql('create table `whitelisted_users` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `email` varchar(255) not null, `pass_id` varchar(36) not null, `created` tinyint(1) not null default false, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `whitelisted_users` add index `whitelisted_users_pass_id_index`(`pass_id`);');
    this.addSql('alter table `whitelisted_users` add unique `whitelisted_users_email_pass_id_unique`(`email`, `pass_id`);');

    this.addSql('alter table `scheduled_event` add constraint `scheduled_event_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `report` add constraint `report_reporter_id_foreign` foreign key (`reporter_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `report` add constraint `report_reportee_id_foreign` foreign key (`reportee_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `profile` add constraint `profile_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `post` add constraint `post_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `post_tip` add constraint `post_tip_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `post_tip` add constraint `post_tip_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade;');

    this.addSql('alter table `post_like` add constraint `post_like_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade;');
    this.addSql('alter table `post_like` add constraint `post_like_liker_id_foreign` foreign key (`liker_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `post_history` add constraint `post_history_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade;');

    this.addSql('alter table `post_category` add constraint `post_category_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `post_to_category` add constraint `post_to_category_post_category_id_foreign` foreign key (`post_category_id`) references `post_category` (`id`) on update cascade;');
    this.addSql('alter table `post_to_category` add constraint `post_to_category_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade;');

    this.addSql('alter table `persona_inquiry` add constraint `persona_inquiry_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `persona_verification` add constraint `persona_verification_inquiry_id_foreign` foreign key (`inquiry_id`) references `persona_inquiry` (`id`) on update cascade;');

    this.addSql('alter table `pass` add constraint `pass_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `post_pass_access` add constraint `post_pass_access_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade;');
    this.addSql('alter table `post_pass_access` add constraint `post_pass_access_pass_id_foreign` foreign key (`pass_id`) references `pass` (`id`) on update cascade;');

    this.addSql('alter table `pass_purchase` add constraint `pass_purchase_pass_id_foreign` foreign key (`pass_id`) references `pass` (`id`) on update cascade;');
    this.addSql('alter table `pass_purchase` add constraint `pass_purchase_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `paid_message` add constraint `paid_message_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `paid_message_history` add constraint `paid_message_history_paid_message_id_foreign` foreign key (`paid_message_id`) references `paid_message` (`id`) on update cascade;');

    this.addSql('alter table `notification_settings` add constraint `notification_settings_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `notification` add constraint `notification_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `notification` add constraint `notification_sender_id_foreign` foreign key (`sender_id`) references `users` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `message` add constraint `message_sender_id_foreign` foreign key (`sender_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `message` add constraint `message_channel_id_foreign` foreign key (`channel_id`) references `channel` (`id`) on update cascade;');
    this.addSql('alter table `message` add constraint `message_reply_id_foreign` foreign key (`reply_id`) references `message` (`id`) on update cascade on delete set null;');
    this.addSql('alter table `message` add constraint `message_paid_message_id_foreign` foreign key (`paid_message_id`) references `paid_message` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `list` add constraint `list_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `list_member` add constraint `list_member_list_id_foreign` foreign key (`list_id`) references `list` (`id`) on update cascade;');
    this.addSql('alter table `list_member` add constraint `list_member_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `follow` add constraint `follow_follower_id_foreign` foreign key (`follower_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `follow` add constraint `follow_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `follow_block` add constraint `follow_block_follower_id_foreign` foreign key (`follower_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `follow_block` add constraint `follow_block_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `fan_wall_comment` add constraint `fan_wall_comment_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `fan_wall_comment` add constraint `fan_wall_comment_commenter_id_foreign` foreign key (`commenter_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `creator_verification` add constraint `creator_verification_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `creator_stat` add constraint `creator_stat_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `creator_settings` add constraint `creator_settings_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `creator_fee` add constraint `creator_fee_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `creator_earning_history` add constraint `creator_earning_history_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `creator_earning` add constraint `creator_earning_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `content` add constraint `content_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `comment` add constraint `comment_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade;');
    this.addSql('alter table `comment` add constraint `comment_commenter_id_foreign` foreign key (`commenter_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `circle_card` add constraint `circle_card_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `payin` add constraint `payin_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `payin` add constraint `payin_card_id_foreign` foreign key (`card_id`) references `circle_card` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `post_user_access` add constraint `post_user_access_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade;');
    this.addSql('alter table `post_user_access` add constraint `post_user_access_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `post_user_access` add constraint `post_user_access_payin_id_foreign` foreign key (`payin_id`) references `payin` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `creator_share` add constraint `creator_share_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `creator_share` add constraint `creator_share_payin_id_foreign` foreign key (`payin_id`) references `payin` (`id`) on update cascade;');

    this.addSql('alter table `default_payin_method` add constraint `default_payin_method_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `default_payin_method` add constraint `default_payin_method_card_id_foreign` foreign key (`card_id`) references `circle_card` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `circle_payment` add constraint `circle_payment_card_id_foreign` foreign key (`card_id`) references `circle_card` (`id`) on update cascade;');
    this.addSql('alter table `circle_payment` add constraint `circle_payment_payin_id_foreign` foreign key (`payin_id`) references `payin` (`id`) on update cascade;');

    this.addSql('alter table `circle_chargeback` add constraint `circle_chargeback_circle_payment_id_foreign` foreign key (`circle_payment_id`) references `circle_payment` (`id`) on update cascade;');

    this.addSql('alter table `circle_bank` add constraint `circle_bank_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete set null;');
    this.addSql('alter table `circle_bank` add constraint `circle_bank_agency_id_foreign` foreign key (`agency_id`) references `agency` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `agency` add constraint `agency_bank_id_foreign` foreign key (`bank_id`) references `circle_bank` (`id`) on update cascade;');

    this.addSql('alter table `creator_agency` add constraint `creator_agency_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `creator_agency` add constraint `creator_agency_agency_id_foreign` foreign key (`agency_id`) references `agency` (`id`) on update cascade;');

    this.addSql('alter table `channel_member` add constraint `channel_member_channel_id_foreign` foreign key (`channel_id`) references `channel` (`id`) on update cascade;');
    this.addSql('alter table `channel_member` add constraint `channel_member_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `channel_member` add constraint `channel_member_other_user_id_foreign` foreign key (`other_user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `block_task` add constraint `block_task_follower_id_foreign` foreign key (`follower_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `block_task` add constraint `block_task_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `auth` add constraint `auth_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `reset_password_request` add constraint `reset_password_request_auth_id_foreign` foreign key (`auth_id`) references `auth` (`id`) on update cascade;');

    this.addSql('alter table `user_external_pass` add constraint `user_external_pass_pass_id_foreign` foreign key (`pass_id`) references `pass` (`id`) on update cascade;');
    this.addSql('alter table `user_external_pass` add constraint `user_external_pass_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `user_message_content` add constraint `user_message_content_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `user_message_content` add constraint `user_message_content_content_id_foreign` foreign key (`content_id`) references `content` (`id`) on update cascade;');

    this.addSql('alter table `user_spending` add constraint `user_spending_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `user_spending` add constraint `user_spending_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `verify_email_request` add constraint `verify_email_request_auth_id_foreign` foreign key (`auth_id`) references `auth` (`id`) on update cascade;');

    this.addSql('alter table `wallet` add constraint `wallet_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `payout` add constraint `payout_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete set null;');
    this.addSql('alter table `payout` add constraint `payout_agency_id_foreign` foreign key (`agency_id`) references `agency` (`id`) on update cascade on delete set null;');
    this.addSql('alter table `payout` add constraint `payout_bank_id_foreign` foreign key (`bank_id`) references `circle_bank` (`id`) on update cascade on delete set null;');
    this.addSql('alter table `payout` add constraint `payout_wallet_id_foreign` foreign key (`wallet_id`) references `wallet` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `circle_transfer` add constraint `circle_transfer_payout_id_foreign` foreign key (`payout_id`) references `payout` (`id`) on update cascade;');

    this.addSql('alter table `circle_payout` add constraint `circle_payout_bank_id_foreign` foreign key (`bank_id`) references `circle_bank` (`id`) on update cascade;');
    this.addSql('alter table `circle_payout` add constraint `circle_payout_payout_id_foreign` foreign key (`payout_id`) references `payout` (`id`) on update cascade;');

    this.addSql('alter table `pass_holder` add constraint `pass_holder_pass_id_foreign` foreign key (`pass_id`) references `pass` (`id`) on update cascade;');
    this.addSql('alter table `pass_holder` add constraint `pass_holder_holder_id_foreign` foreign key (`holder_id`) references `users` (`id`) on update cascade on delete set null;');
    this.addSql('alter table `pass_holder` add constraint `pass_holder_wallet_id_foreign` foreign key (`wallet_id`) references `wallet` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `subscription` add constraint `subscription_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `subscription` add constraint `subscription_card_id_foreign` foreign key (`card_id`) references `circle_card` (`id`) on update cascade on delete set null;');
    this.addSql('alter table `subscription` add constraint `subscription_pass_holder_id_foreign` foreign key (`pass_holder_id`) references `pass_holder` (`id`) on update cascade;');

    this.addSql('alter table `default_wallet` add constraint `default_wallet_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `default_wallet` add constraint `default_wallet_wallet_id_foreign` foreign key (`wallet_id`) references `wallet` (`id`) on update cascade;');

    this.addSql('alter table `default_payout_method` add constraint `default_payout_method_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `default_payout_method` add constraint `default_payout_method_bank_id_foreign` foreign key (`bank_id`) references `circle_bank` (`id`) on update cascade on delete set null;');
    this.addSql('alter table `default_payout_method` add constraint `default_payout_method_wallet_id_foreign` foreign key (`wallet_id`) references `wallet` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `welcome_messaged` add constraint `welcome_messaged_follower_id_foreign` foreign key (`follower_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `welcome_messaged` add constraint `welcome_messaged_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `whitelisted_users` add constraint `whitelisted_users_pass_id_foreign` foreign key (`pass_id`) references `pass` (`id`) on update cascade;');
  }

}

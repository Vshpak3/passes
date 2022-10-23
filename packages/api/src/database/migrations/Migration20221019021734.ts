import { Migration } from '@mikro-orm/migrations'

export class Migration20221019021734 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `channel` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `circle_notification` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `eth_nonce` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `facebook_deletion_request` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `users` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `scheduled_event` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `report` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `profile` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `post` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `post_like` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `post_history` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `persona_inquiry` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `persona_verification` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `pass` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `post_pass_access` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `pass_purchase` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `paid_message` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `paid_message_history` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `notification_settings` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `notification` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `message` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), modify `sent_at` datetime(3) not null default current_timestamp(3);',
    )

    this.addSql(
      'alter table `list` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `list_member` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `follow` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `follow_block` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `fan_wall_comment` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `creator_verification` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `creator_stat` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `creator_settings` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `creator_fee` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `creator_earning_history` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `creator_earning` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `content` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `comment` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `circle_card` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `payin` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `post_user_access` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `post_tip` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `creator_share` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `default_payin_method` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `circle_payment` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `circle_chargeback` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `circle_bank` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `channel_member` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `block_task` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `auth` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `reset_password_request` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `user_external_pass` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `user_message_content` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `verify_email_request` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `wallet` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `payout` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `circle_transfer` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `circle_payout` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `pass_holder` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `subscription` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `default_wallet` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `default_payout_method` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `welcome_messaged` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )

    this.addSql(
      'alter table `whitelisted_users` modify `created_at` datetime(3) not null default current_timestamp(3), modify `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3);',
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `channel` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `circle_notification` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `eth_nonce` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `facebook_deletion_request` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `users` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `scheduled_event` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `report` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `profile` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `post` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `post_like` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `post_history` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `persona_inquiry` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `persona_verification` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `pass` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `post_pass_access` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `pass_purchase` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `paid_message` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `paid_message_history` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `notification_settings` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `notification` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `message` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, modify `sent_at` datetime(3) not null default CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `list` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `list_member` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `follow` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `follow_block` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `fan_wall_comment` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `creator_verification` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `creator_stat` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `creator_settings` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `creator_fee` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `creator_earning_history` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `creator_earning` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `content` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `comment` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `circle_card` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `payin` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `post_user_access` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `post_tip` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `creator_share` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `default_payin_method` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `circle_payment` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `circle_chargeback` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `circle_bank` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `channel_member` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `block_task` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `auth` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `reset_password_request` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `user_external_pass` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `user_message_content` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `verify_email_request` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `wallet` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `payout` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `circle_transfer` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `circle_payout` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `pass_holder` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `subscription` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `default_wallet` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `default_payout_method` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `welcome_messaged` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )

    this.addSql(
      'alter table `whitelisted_users` modify `created_at` datetime(3) not null default CURRENT_TIMESTAMP, modify `updated_at` datetime(3) not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;',
    )
  }
}

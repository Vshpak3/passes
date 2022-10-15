import { Migration } from '@mikro-orm/migrations'

export class Migration20220930143740 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `channel` add index `channel_recent_index`(`recent`);',
    )

    this.addSql(
      'alter table `message` add index `message_sent_at_index`(`sent_at`);',
    )

    this.addSql(
      'alter table `channel_member` add index `channel_member_unread_tip_index`(`unread_tip`);',
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table `channel` drop index `channel_recent_index`;')

    this.addSql('alter table `message` drop index `message_sent_at_index`;')

    this.addSql(
      'alter table `channel_member` drop index `channel_member_unread_tip_index`;',
    )
  }
}

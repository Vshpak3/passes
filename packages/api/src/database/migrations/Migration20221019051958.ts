import { Migration } from '@mikro-orm/migrations'

export class Migration20221019051958 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table `creator_earning_history` add `category` enum('net', 'gross', 'agency') not null;",
    )

    this.addSql(
      "alter table `creator_earning` add `category` enum('net', 'gross', 'agency') not null;",
    )
    this.addSql(
      'alter table `creator_earning` drop index `creator_earning_user_id_type_unique`;',
    )
    this.addSql(
      'alter table `creator_earning` add unique `creator_earning_user_id_type_category_unique`(`user_id`, `type`, `category`);',
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `creator_earning` drop index `creator_earning_user_id_type_category_unique`;',
    )
    this.addSql(
      'alter table `creator_earning` add unique `creator_earning_user_id_type_unique`(`user_id`, `type`);',
    )
  }
}

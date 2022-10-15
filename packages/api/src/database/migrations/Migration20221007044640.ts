import { Migration } from '@mikro-orm/migrations'

export class Migration20221007044640 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table `payin` modify `payin_status` enum('registered', 'created_ready', 'created', 'pending', 'successful_ready', 'successful', 'failed_ready', 'failed', 'unregistered', 'action_required', 'reverted', 'fail_callback_failed', 'success_callback_failed', 'create_callback_failed') not null;",
    )
  }

  async down(): Promise<void> {
    this.addSql(
      "alter table `payin` modify `payin_status` enum('registered', 'created', 'pending', 'successful', 'failed', 'unregistered', 'action_required', 'reverted', 'fail_callback_failed', 'success_callback_failed', 'create_callback_failed') not null;",
    )
  }
}

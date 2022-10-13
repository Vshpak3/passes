import { Migration } from '@mikro-orm/migrations';

export class Migration20221013053057 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `pass` add `animation_type` enum(\'mp4\', \'gif\') null, add `image_type` enum(\'jpeg\', \'png\') not null default \'png\';');

    this.addSql('alter table `paid_message` add `paid` int not null default 0;');

    this.addSql('alter table `paid_message_history` add `sent_to` int not null default 0, add `paid` int not null default 0;');

    this.addSql('alter table `content` add `deleted_at` datetime null;');

    this.addSql('alter table `pass_holder` add `animation_type` enum(\'mp4\', \'gif\') null, add `image_type` enum(\'jpeg\', \'png\') not null default \'png\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table `paid_message` add `scheduled_at` datetime null;');
  }

}

import { Migration } from '@mikro-orm/migrations'

export class Migration20221024172716 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `message` add `content_processed` tinyint(1) not null default false;',
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'create table `post_content` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `post_id` varchar(36) not null, `content_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;',
    )
    this.addSql(
      'alter table `post_content` add index `post_content_post_id_index`(`post_id`);',
    )
    this.addSql(
      'alter table `post_content` add index `post_content_content_id_index`(`content_id`);',
    )

    this.addSql(
      'alter table `post_content` add constraint `post_content_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade;',
    )
    this.addSql(
      'alter table `post_content` add constraint `post_content_content_id_foreign` foreign key (`content_id`) references `content` (`id`) on update cascade;',
    )
  }
}

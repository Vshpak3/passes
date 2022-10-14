import { Migration } from '@mikro-orm/migrations'

export class Migration20221014051036 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table `post` add `contents` varchar(5000) not null default '[]', add `preview_index` int not null default 0;",
    )

    this.addSql(
      "alter table `paid_message` add `contents` varchar(5000) not null default '[]', add `preview_index` int not null default 0, add `is_welcome_message` tinyint(1) not null default false;",
    )

    this.addSql(
      "alter table `message` add `contents` varchar(5000) not null default '[]', add `preview_index` int not null default 0;",
    )

    this.addSql(
      'alter table `creator_settings` modify `welcome_message` tinyint(1) not null default false;',
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'create table `post_content` (`id` varchar(36) not null default (UUID()), `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, `post_id` varchar(36) not null, `content_id` varchar(36) not null, `index` int not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;',
    )
    this.addSql(
      'alter table `post_content` add index `post_content_post_id_index`(`post_id`);',
    )
    this.addSql(
      'alter table `post_content` add index `post_content_content_id_index`(`content_id`);',
    )
    this.addSql(
      'alter table `post_content` add unique `post_content_post_id_content_id_index_unique`(`post_id`, `content_id`, `index`);',
    )

    this.addSql(
      'alter table `post_content` add constraint `post_content_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade;',
    )
    this.addSql(
      'alter table `post_content` add constraint `post_content_content_id_foreign` foreign key (`content_id`) references `content` (`id`) on update cascade;',
    )

    this.addSql(
      "alter table `paid_message` add `content_ids` varchar(500) not null default '[]';",
    )

    this.addSql(
      "alter table `message` add `content_ids` varchar(500) not null default '[]';",
    )

    this.addSql(
      'alter table `creator_settings` modify `welcome_message` varchar(500) null;',
    )
  }
}

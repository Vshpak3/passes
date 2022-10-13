import { Migration } from '@mikro-orm/migrations';

export class Migration20221013220227 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `pass` add `access_type` enum(\'pass access\', \'account_access\') not null;');

    this.addSql('alter table `post_user_access` add `pass_holder_ids` varchar(500) not null;');

    this.addSql('alter table `pass_holder` add `access_type` enum(\'pass access\', \'account_access\') not null;');
  }

  async down(): Promise<void> {
    this.addSql('create table `post_pass_holder_access` (`id` varchar(36) not null default (UUID()), `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, `post_user_access_id` varchar(36) not null, `pass_holder_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_pass_holder_access` add index `post_pass_holder_access_post_user_access_id_index`(`post_user_access_id`);');
    this.addSql('alter table `post_pass_holder_access` add index `post_pass_holder_access_pass_holder_id_index`(`pass_holder_id`);');
    this.addSql('alter table `post_pass_holder_access` add unique `post_pass_holder_access_post_user_access_id_pass_h_6a000_unique`(`post_user_access_id`, `pass_holder_id`);');

    this.addSql('alter table `post_pass_holder_access` add constraint `post_pass_holder_access_post_user_access_id_foreign` foreign key (`post_user_access_id`) references `post_user_access` (`id`) on update cascade;');
    this.addSql('alter table `post_pass_holder_access` add constraint `post_pass_holder_access_pass_holder_id_foreign` foreign key (`pass_holder_id`) references `pass_holder` (`id`) on update cascade;');

    this.addSql('alter table `pass_holder` add `ignored` tinyint(1) not null default false;');
  }

}

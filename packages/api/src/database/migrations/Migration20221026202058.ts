import { Migration } from '@mikro-orm/migrations';

export class Migration20221026202058 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `post_category` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `user_id` varchar(36) not null, `name` varchar(25) not null, `count` int not null default 0, `order` int not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_category` add index `post_category_user_id_index`(`user_id`);');
    this.addSql('alter table `post_category` add unique `post_category_name_user_id_unique`(`name`, `user_id`);');

    this.addSql('create table `post_to_category` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `post_category_id` varchar(36) not null, `post_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `post_to_category` add index `post_to_category_post_category_id_index`(`post_category_id`);');
    this.addSql('alter table `post_to_category` add index `post_to_category_post_id_index`(`post_id`);');
    this.addSql('alter table `post_to_category` add unique `post_to_category_post_category_id_post_id_unique`(`post_category_id`, `post_id`);');

    this.addSql('alter table `post_category` add constraint `post_category_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `post_to_category` add constraint `post_to_category_post_category_id_foreign` foreign key (`post_category_id`) references `post_category` (`id`) on update cascade;');
    this.addSql('alter table `post_to_category` add constraint `post_to_category_post_id_foreign` foreign key (`post_id`) references `post` (`id`) on update cascade;');
  }

}

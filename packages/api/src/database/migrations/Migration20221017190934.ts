import { Migration } from '@mikro-orm/migrations';

export class Migration20221017190934 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `report` (`id` varchar(36) not null default (UUID()), `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, `reporter_id` varchar(36) not null, `reportee_id` varchar(36) not null, `reason` varchar(250) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `report` add index `report_reporter_id_index`(`reporter_id`);');
    this.addSql('alter table `report` add index `report_reportee_id_index`(`reportee_id`);');
    this.addSql('alter table `report` add index `report_created_at_index`(`created_at`);');

    this.addSql('alter table `report` add constraint `report_reporter_id_foreign` foreign key (`reporter_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `report` add constraint `report_reportee_id_foreign` foreign key (`reportee_id`) references `users` (`id`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table `follow_report` (`id` varchar(36) not null default (UUID()), `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, `follower_id` varchar(36) not null, `creator_id` varchar(36) not null, `reason` varchar(250) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `follow_report` add index `follow_report_follower_id_index`(`follower_id`);');
    this.addSql('alter table `follow_report` add index `follow_report_creator_id_index`(`creator_id`);');
    this.addSql('alter table `follow_report` add index `follow_report_created_at_index`(`created_at`);');

    this.addSql('alter table `follow_report` add constraint `follow_report_follower_id_foreign` foreign key (`follower_id`) references `users` (`id`) on update cascade;');
    this.addSql('alter table `follow_report` add constraint `follow_report_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade;');
  }

}

import { Migration } from '@mikro-orm/migrations'

export class Migration20221028174431 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `agency` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `name` varchar(50) not null, `email` varchar(255) not null, `bank_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;',
    )
    this.addSql('alter table `agency` add unique `agency_name_unique`(`name`);')
    this.addSql(
      'alter table `agency` add unique `agency_email_unique`(`email`);',
    )
    this.addSql(
      'alter table `agency` add unique `agency_bank_id_unique`(`bank_id`);',
    )

    this.addSql(
      'create table `creator_agency` (`id` varchar(36) not null default (UUID()), `created_at` datetime(3) not null default current_timestamp(3), `updated_at` datetime(3) not null default current_timestamp(3) on update CURRENT_TIMESTAMP(3), `creator_id` varchar(36) not null, `agency_id` varchar(36) not null, `rate` float not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;',
    )
    this.addSql(
      'alter table `creator_agency` add unique `creator_agency_creator_id_unique`(`creator_id`);',
    )
    this.addSql(
      'alter table `creator_agency` add index `creator_agency_agency_id_index`(`agency_id`);',
    )

    this.addSql(
      'alter table `agency` add constraint `agency_bank_id_foreign` foreign key (`bank_id`) references `circle_bank` (`id`) on update cascade;',
    )

    this.addSql(
      'alter table `creator_agency` add constraint `creator_agency_creator_id_foreign` foreign key (`creator_id`) references `users` (`id`) on update cascade;',
    )
    this.addSql(
      'alter table `creator_agency` add constraint `creator_agency_agency_id_foreign` foreign key (`agency_id`) references `agency` (`id`) on update cascade;',
    )

    this.addSql(
      'alter table `circle_bank` drop foreign key `circle_bank_user_id_foreign`;',
    )

    this.addSql(
      'alter table `payout` drop foreign key `payout_user_id_foreign`;',
    )

    this.addSql(
      'alter table `creator_fee` modify `fiat_flat` decimal(12, 2), modify `crypto_rate` float;',
    )

    this.addSql('alter table `circle_bank` add `agency_id` varchar(36) null;')
    this.addSql('alter table `circle_bank` modify `user_id` varchar(36) null;')
    this.addSql(
      'alter table `circle_bank` add constraint `circle_bank_agency_id_foreign` foreign key (`agency_id`) references `agency` (`id`) on update cascade on delete set null;',
    )
    this.addSql(
      'alter table `circle_bank` add constraint `circle_bank_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete set null;',
    )
    this.addSql(
      'alter table `circle_bank` add unique `circle_bank_agency_id_unique`(`agency_id`);',
    )

    this.addSql('alter table `payout` add `agency_id` varchar(36) null;')
    this.addSql('alter table `payout` modify `user_id` varchar(36) null;')
    this.addSql(
      'alter table `payout` add constraint `payout_agency_id_foreign` foreign key (`agency_id`) references `agency` (`id`) on update cascade on delete set null;',
    )
    this.addSql(
      'alter table `payout` add constraint `payout_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete set null;',
    )
    this.addSql(
      'alter table `payout` add index `payout_agency_id_index`(`agency_id`);',
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `circle_bank` drop foreign key `circle_bank_user_id_foreign`;',
    )

    this.addSql(
      'alter table `payout` drop foreign key `payout_user_id_foreign`;',
    )

    this.addSql(
      'alter table `creator_fee` modify `fiat_flat` float, modify `crypto_rate` decimal(12, 2);',
    )

    this.addSql(
      'alter table `circle_bank` modify `user_id` varchar(36) not null;',
    )
    this.addSql(
      'alter table `circle_bank` drop index `circle_bank_agency_id_unique`;',
    )
    this.addSql(
      'alter table `circle_bank` add constraint `circle_bank_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
    )

    this.addSql('alter table `payout` modify `user_id` varchar(36) not null;')
    this.addSql('alter table `payout` drop index `payout_agency_id_index`;')
    this.addSql(
      'alter table `payout` add constraint `payout_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;',
    )
  }
}

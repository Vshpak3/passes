import { Migration } from '@mikro-orm/migrations'

export class Migration20220621035715 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "is_kycverified" boolean not null, "wallet_address" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "user_name" varchar(255) null, "password_hash" varchar(255) not null, "profile_id" int not null, "last_login" timestamptz(0) not null, "phone_number" varchar(255) not null, "payment_id" int not null);',
    )
    this.addSql(
      'alter table "user" add constraint "user_pkey" primary key ("id");',
    )

    this.addSql(
      'create table "subscription" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "subscribed_at" timestamptz(0) not null, "num_posts_liked" int not null, "num_comments" int not null, "amount_spent" varchar(255) not null, "num_total_likes" int not null, "num_shared" int not null);',
    )
    this.addSql(
      'alter table "subscription" add constraint "subscription_pkey" primary key ("id");',
    )

    this.addSql(
      'create table "settings" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" int not null);',
    )
    this.addSql(
      'alter table "settings" add constraint "settings_pkey" primary key ("id");',
    )

    this.addSql(
      'create table "profile" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" int not null, "description" varchar(255) not null, "unsubscribed_at" timestamptz(0) not null, "is_creator" boolean not null, "instagram_url" varchar(255) null, "tiktok_url" varchar(255) null, "youtube_url" varchar(255) null, "discord_url" varchar(255) null, "twitch_url" varchar(255) null, "subscribers_id" int null, "total_posts" int not null, "total_likes" int not null);',
    )
    this.addSql(
      'alter table "profile" add constraint "profile_pkey" primary key ("id");',
    )

    this.addSql(
      'create table "post" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "num_likes" int not null, "num_comments" int not null, "is_locked" boolean not null, "num_earned" varchar(255) not null, "num_shared" int not null, "is_featured" boolean not null, "content" varchar(255) not null, "user_id" int not null);',
    )
    this.addSql(
      'alter table "post" add constraint "post_pkey" primary key ("id");',
    )

    this.addSql(
      'create table "comment" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "comment" varchar(255) not null, "post_id" int not null, "sender_id" int not null, "receiver_id" int not null, "date_commented" timestamptz(0) not null);',
    )
    this.addSql(
      'alter table "comment" add constraint "comment_pkey" primary key ("id");',
    )

    this.addSql(
      'create table "pass" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "profile_id" int not null, "wallet_address" varchar(255) not null, "description" varchar(255) not null, "blockchain" varchar(255) not null, "contract_address" varchar(255) not null, "token_id" int not null, "num_views" int not null, "num_favorites" int not null, "rarity_rank" int not null, "price" varchar(255) not null, "paid" varchar(255) not null);',
    )
    this.addSql(
      'alter table "pass" add constraint "pass_pkey" primary key ("id");',
    )
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;')

    this.addSql('drop table if exists "subscription" cascade;')

    this.addSql('drop table if exists "settings" cascade;')

    this.addSql('drop table if exists "profile" cascade;')

    this.addSql('drop table if exists "post" cascade;')

    this.addSql('drop table if exists "comment" cascade;')

    this.addSql('drop table if exists "pass" cascade;')
  }
}

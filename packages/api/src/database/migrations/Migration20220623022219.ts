import { Migration } from '@mikro-orm/migrations';

export class Migration20220623022219 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "user_name" varchar(30) not null, "full_name" varchar(50) null, "phone_number" varchar(255) null, "birthday" timestamptz(0) null, "is_kycverified" boolean not null, "is_creator" boolean not null);');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');

    this.addSql('create table "subscription" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "subscriber_id" uuid not null, "creator_id" uuid not null, "is_active" boolean not null);');
    this.addSql('alter table "subscription" add constraint "subscription_pkey" primary key ("id");');

    this.addSql('create table "settings" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" uuid not null);');
    this.addSql('alter table "settings" add constraint "settings_user_id_unique" unique ("user_id");');
    this.addSql('alter table "settings" add constraint "settings_pkey" primary key ("id");');

    this.addSql('create table "profile" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" uuid not null, "description" varchar(255) null, "instagram_url" varchar(255) null, "tiktok_url" varchar(255) null, "youtube_url" varchar(255) null, "discord_url" varchar(255) null, "twitch_url" varchar(255) null);');
    this.addSql('alter table "profile" add constraint "profile_user_id_unique" unique ("user_id");');
    this.addSql('alter table "profile" add constraint "profile_pkey" primary key ("id");');

    this.addSql('create table "post" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" uuid not null, "num_likes" int not null, "num_comments" int not null);');
    this.addSql('alter table "post" add constraint "post_pkey" primary key ("id");');

    this.addSql('create table "pass" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" uuid not null);');
    this.addSql('alter table "pass" add constraint "pass_pkey" primary key ("id");');

    this.addSql('create table "comment" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "post_id" uuid not null, "commenter_id" uuid not null, "content" varchar(150) not null);');
    this.addSql('alter table "comment" add constraint "comment_pkey" primary key ("id");');

    this.addSql('alter table "subscription" add constraint "subscription_subscriber_id_foreign" foreign key ("subscriber_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "subscription" add constraint "subscription_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "settings" add constraint "settings_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "profile" add constraint "profile_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "post" add constraint "post_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "pass" add constraint "pass_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "comment" add constraint "comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_commenter_id_foreign" foreign key ("commenter_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "subscription" drop constraint "subscription_subscriber_id_foreign";');

    this.addSql('alter table "subscription" drop constraint "subscription_creator_id_foreign";');

    this.addSql('alter table "settings" drop constraint "settings_user_id_foreign";');

    this.addSql('alter table "profile" drop constraint "profile_user_id_foreign";');

    this.addSql('alter table "post" drop constraint "post_user_id_foreign";');

    this.addSql('alter table "pass" drop constraint "pass_user_id_foreign";');

    this.addSql('alter table "comment" drop constraint "comment_commenter_id_foreign";');

    this.addSql('alter table "comment" drop constraint "comment_post_id_foreign";');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "subscription" cascade;');

    this.addSql('drop table if exists "settings" cascade;');

    this.addSql('drop table if exists "profile" cascade;');

    this.addSql('drop table if exists "post" cascade;');

    this.addSql('drop table if exists "pass" cascade;');

    this.addSql('drop table if exists "comment" cascade;');
  }

}

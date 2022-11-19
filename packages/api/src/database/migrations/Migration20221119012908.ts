import { Migration } from '@mikro-orm/migrations';

export class Migration20221119012908 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` add `public` tinyint(1) not null default true;');
  }

}

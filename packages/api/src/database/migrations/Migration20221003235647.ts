import { Migration } from '@mikro-orm/migrations';

export class Migration20221003235647 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `pass` add `eth_price` decimal(50, 0) null;');

    this.addSql('alter table `payin` add `amount_eth` decimal(50, 0) null;');
  }

}

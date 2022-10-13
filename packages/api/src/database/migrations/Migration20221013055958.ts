import { Migration } from '@mikro-orm/migrations'

export class Migration20221013055958 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table `pass` modify `animation_type` enum('mp4', 'mov'), modify `image_type` enum('jpeg', 'png', 'gif') not null default 'png';",
    )

    this.addSql(
      "alter table `pass_holder` modify `animation_type` enum('mp4', 'mov'), modify `image_type` enum('jpeg', 'png', 'gif') not null default 'png';",
    )
  }

  async down(): Promise<void> {
    this.addSql(
      "alter table `pass` modify `animation_type` enum('mp4', 'gif'), modify `image_type` enum('jpeg', 'png') not null default 'png';",
    )

    this.addSql(
      "alter table `pass_holder` modify `animation_type` enum('mp4', 'gif'), modify `image_type` enum('jpeg', 'png') not null default 'png';",
    )
  }
}

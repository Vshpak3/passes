import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { UserEntity } from '../user/entities/user.entity'
import { AgencyMemberDto } from './dto/agency-member.dto'
import { AgencyEntity } from './entities/agency.entity'
import { CreatorAgencyEntity } from './entities/creator-agency.entity'

@Injectable()
export class AgencyService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async addCreator(creatorId: string, agencyId: string, rate: number) {
    await this.dbWriter<CreatorAgencyEntity>(CreatorAgencyEntity.table)
      .insert({
        creator_id: creatorId,
        agency_id: agencyId,
        rate,
      })
      .onConflict()
      .merge(['rate'])
  }

  async removeCreator(creatorId: string, agencyId: string) {
    await this.dbWriter<CreatorAgencyEntity>(CreatorAgencyEntity.table)
      .where({
        creator_id: creatorId,
        agency_id: agencyId,
      })
      .delete()
  }

  async getMembers(agencyId: string) {
    return (
      await this.dbReader<CreatorAgencyEntity>(CreatorAgencyEntity.table)
        .leftJoin(
          AgencyEntity.table,
          `${AgencyEntity.table}.id`,
          `${CreatorAgencyEntity.table}.agency_id`,
        )
        .leftJoin(
          UserEntity.table,
          `${CreatorAgencyEntity.table}.creator_ud`,
          `${UserEntity.table}.id`,
        )
        .where(`${CreatorAgencyEntity.table}.agency_id`, agencyId)
        .select(
          `${CreatorAgencyEntity.table}.*`,
          `${AgencyEntity.table}.name`,
          `${UserEntity.table}.username`,
          `${UserEntity.table}.display_name`,
        )
    ).map((agencyMember) => new AgencyMemberDto(agencyMember))
  }

  async getCovetedAgency() {
    const agency = await this.dbReader<AgencyEntity>(AgencyEntity.table)
      .where({ name: 'coveted' })
      .select('*')
      .first()
    if (!agency) {
      throw new InternalServerErrorException('Coveted agency not found')
    }

    return agency.id
  }
}

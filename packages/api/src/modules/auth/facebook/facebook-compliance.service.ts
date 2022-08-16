import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import crypto from 'crypto'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../../database/database.decorator'
import { DatabaseService } from '../../../database/database.service'
import { FacebookDeletionRequestDto } from '../dto/fb-deletion-request'
import { FacebookDeletionRequestEntity } from '../entities/facebook-deletion-request.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Injectable()
export class FacebookComplianceService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
    private readonly dbWriter: DatabaseService['knex'],
  ) {}

  async initiateDeletionRequest(signedRequest: string): Promise<string> {
    const [encodedSignature, payload] = signedRequest.split('.', 2)
    if (encodedSignature === null || payload === null) {
      throw new BadRequestException('Signed request has invalid format')
    }

    // URL Decode
    const signature = encodedSignature.replace(/-/g, '+').replace(/_/g, '/')

    // Some reason actual signature has '=' appended
    const expectedSignature = this.getExpectedSignature(payload)
    const signatureWithEq = signature + '='

    if (signatureWithEq !== expectedSignature) {
      throw new BadRequestException('Signed request has invalid signature')
    }

    const decodedBody = JSON.parse(payload) as FacebookDeletionRequestDto
    if (!decodedBody.user_id) {
      throw new BadRequestException(
        'Failed to get user id from deletion request',
      )
    }

    this.dbWriter
      .transaction(async (trx) => {
        const id = uuid.v4()
        const userId = decodedBody.user_id

        const request = {
          id,
          facebook_user_id: userId,
        }
        await trx(FacebookDeletionRequestEntity.table).insert(request)

        await trx(UserEntity.table)
          .update({ email: null })
          .where('oauth_id', userId)
          .where('oauth_provider', 'facebook')

        return id
      })
      .catch((err) => {
        this.logger.error(err)
        throw new InternalServerErrorException()
      })

    return ''
  }

  private getExpectedSignature(payload: string) {
    const secret = this.configService.get('oauth.facebook.secret')
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(payload)
    return hmac.digest('base64')
  }

  async checkDeletionRequest(confirmationCode: string): Promise<boolean> {
    const res = await this.dbReader(FacebookDeletionRequestEntity.table).where(
      'id',
      confirmationCode,
    )

    return res.length > 0
  }
}

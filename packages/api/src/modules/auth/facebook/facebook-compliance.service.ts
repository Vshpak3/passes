import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import crypto from 'crypto'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as uuid from 'uuid'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../../database/database.decorator'
import { DatabaseService } from '../../../database/database.service'
import { FacebookDeletionRequestDto } from '../dto/fb/fb-deletion-request.dto'
import { FacebookDeletionRequestEntity } from '../entities/facebook-deletion-request.entity'

@Injectable()
export class FacebookComplianceService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
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

    const id = uuid.v4()
    const userId = decodedBody.user_id

    await this.dbWriter.transaction(async (trx) => {
      await trx<FacebookDeletionRequestEntity>(
        FacebookDeletionRequestEntity.table,
      ).insert({
        id,
        facebook_user_id: userId,
      })

      // Don't actually do an update since this will break out relations; we
      // also don't break if we actually received this information from fb
      // await trx<AuthEntity>(AuthEntity.table)
      //   .update({ email: undefined })
      //   .where({ oauth_id: userId })
      //   .where({ oauth_provider: 'facebook' })
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
    const res = await this.dbReader<FacebookDeletionRequestEntity>(
      FacebookDeletionRequestEntity.table,
    ).where({ id: confirmationCode })

    return res.length > 0
  }
}

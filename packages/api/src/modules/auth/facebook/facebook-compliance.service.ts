import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import crypto from 'crypto'
import * as uuid from 'uuid'

import { Database } from '../../../database/database.decorator'
import { DatabaseService } from '../../../database/database.service'
import { FacebookDeletionRequestDto } from '../dto/fb-deletion-request'

@Injectable()
export class FacebookComplianceService {
  constructor(
    @Database('ReadOnly')
    private readonly ReadOnlyDatabaseService: DatabaseService,
    @Database('ReadWrite')
    private readonly ReadWriteDatabaseService: DatabaseService,
    private readonly configService: ConfigService,
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

    const { knex } = this.ReadWriteDatabaseService
    knex
      .transaction(async (trx) => {
        const id = uuid.v4()
        const userId = decodedBody.user_id

        const request = {
          id,
          facebook_user_id: userId,
        }
        await trx('facebook_deletion_request').insert(request)

        await trx('users')
          .update({ email: null })
          .where('oauth_id', userId)
          .where('oauth_provider', 'facebook')

        return id
      })
      .catch((err) => {
        console.log(err)
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
    const { knex } = this.ReadOnlyDatabaseService
    const res = await knex('facebook_deletion_request').where(
      'id',
      confirmationCode,
    )

    return res.length > 0
  }
}

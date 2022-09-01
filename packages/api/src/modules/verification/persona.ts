import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { get } from 'lodash'

import { PersonaResponseStatusError } from './error/persona.error'

export class PersonaConnector {
  instance
  constructor(private readonly configService: ConfigService) {
    this.instance = axios.create({
      baseURL: 'https://withpersona.com/api/',
      headers: {
        Authorization: `Bearer ${this.configService.get('persona.api_key')}`,
      },
    })
    this.instance.interceptors.response.use(
      function (response) {
        if (get(response, 'data.data')) {
          return response.data.data
        }
        return response
      },
      function (error) {
        const status = error['response']['status']
        const message = error['response']['data']['message']
        return Promise.reject(new PersonaResponseStatusError(message, status))
      },
    )
  }

  getInquiry(inquiryId: string) {
    const url = `/v1/inquiries/${inquiryId}`
    return this.instance.get(url)
  }

  getVerification(verificationId: string) {
    const url = `/v1/verifications/${verificationId}`
    return this.instance.get(url)
  }
}

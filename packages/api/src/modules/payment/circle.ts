import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { get } from 'lodash'

import { CircleCreateAddressRequestDto } from './dto/circle/create-address.dto'
import { CircleCreateBankRequestDto } from './dto/circle/create-bank.dto'
import { CircleCreateCardDto } from './dto/circle/create-card.dto'
import { CircleCreatePaymentRequestDto } from './dto/circle/create-card-payment.dto'
import { CircleCreatePayoutRequestDto } from './dto/circle/create-circle-payout.dto'
import { CircleCreateTransferRequestDto } from './dto/circle/create-circle-transfer.dto'
import { CircleUpdateCardDto } from './dto/circle/update-card.dto'
import { CircleResponseStatusError } from './error/circle.error'

export class CircleConnector {
  instance
  constructor(private readonly configService: ConfigService) {
    this.instance = axios.create({
      baseURL: this.configService.get('circle.api_endpoint'),
      headers: {
        Authorization: `Bearer ${this.configService.get('circle.api_key')}`,
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
        return Promise.reject(new CircleResponseStatusError(message, status))
      },
    )
  }

  nullIfEmpty(prop: string | undefined) {
    if (prop !== undefined && prop.trim() === '') {
      return undefined
    }
    return prop
  }

  /**
   * Returns a public key used to encrypt card details
   *
   * @returns Promise<PublicKey> {"keyId": "key1", "publicKey": "LS0tLS1CRUdJTiBQR1A..." }
   */
  getPCIPublicKey() {
    const url = '/v1/encryption/public'

    return this.instance.get(url)
  }

  /**
   * Get Card
   * @param {String} cardId
   */
  getCardById(cardId: string) {
    const url = `/v1/cards/${cardId}`

    return this.instance.get(url)
  }

  /**
   * Get Cards
   * @param {String} pageBefore
   * @param {String} pageAfter
   * @param {String} pageSize
   *
   * show cards saved for the user before
   */
  getCards(pageBefore: string, pageAfter: string, pageSize: string) {
    const queryParams = {
      pageBefore,
      pageAfter,
      pageSize,
    }

    const url = '/v1/cards'

    return this.instance.get(url, { params: queryParams })
  }

  /**
   * Create Card
   * @param {*} payload (contains form data and encrypted card details)
   */
  createCard(payload: CircleCreateCardDto) {
    const url = '/v1/cards'
    if (payload.metadata) {
      payload.metadata.phoneNumber = this.nullIfEmpty(
        payload.metadata.phoneNumber,
      )
    }
    return this.instance.post(url, payload)
  }

  /**
   * Update card
   *
   * @param {String} cardId
   * @returns Promise
   */
  updateCard(cardId: string, payload: CircleUpdateCardDto) {
    return this.instance.put(`/v1/cards/${cardId}`, payload)
  }

  /**
   * Create payment
   * @param {*} payload (contains form data and encrypted payment details)
   */
  createPayment(payload: CircleCreatePaymentRequestDto) {
    const url = '/v1/payments'
    if (payload.metadata) {
      payload.metadata.phoneNumber = this.nullIfEmpty(
        payload.metadata.phoneNumber,
      )
    }
    return this.instance.post(url, payload)
  }

  /**
   * Create payout
   * @param {*} payload
   */
  createPayout(payload: CircleCreatePayoutRequestDto) {
    const url = '/v1/payouts'
    return this.instance.post(url, payload)
  }

  /**
   * Create transfer
   * @param {*} payload
   */
  createTransfer(payload: CircleCreateTransferRequestDto) {
    const url = '/v1/transfers'
    return this.instance.post(url, payload)
  }

  /**
   * Get a payment
   * @param {String} id
   */
  getPaymentById(id: string) {
    const url = `/v1/payments/${id}`

    return this.instance.get(url)
  }

  /**
   * Get a bank
   * @param {String} id
   */
  getBankById(id: string) {
    const url = `/v1/banks/wires/${id}`

    return this.instance.get(url)
  }

  /**
   * Create an address
   */
  createAddress(walletid: string, payload: CircleCreateAddressRequestDto) {
    const url = `/v1/wallets/${walletid}/addresses`

    return this.instance.post(url, payload)
  }

  /**
   * Create an address
   */
  createBank(payload: CircleCreateBankRequestDto) {
    const url = `/v1/banks/wires`

    return this.instance.post(url, payload)
  }
}

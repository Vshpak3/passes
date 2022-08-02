import { CreateAddressDto } from './dto/circle/create-address.dto'
import { CreateBankDto } from './dto/circle/create-bank.dto'
import { CreateCardDto } from './dto/circle/create-card.dto'
import { BasePaymentDto } from './dto/circle/create-card-payment.dto'
import { UpdateCardDto } from './dto/circle/update-card.dto'

/**
 * Global error handler:
 * Intercepts all axios reponses and maps
 * to errorHandler object
 */
// instance.interceptors.response.use(
//   function (response) {
//     if (get(response, 'data.data')) {
//       return response.data.data
//     }
//     return response
//   },
//   function (error) {
//     let response = get(error, 'response')
//     if (!response) {
//       response = error.toJSON()
//     }
//     return Promise.reject(response)
//   },
// )

const nullIfEmpty = (prop: string | undefined) => {
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
export function getPCIPublicKey(instance) {
  const url = '/v1/encryption/public'

  return instance.get(url)
}

/**
 * Get Card
 * @param {String} cardId
 */
export function getCardById(instance, cardId: string) {
  const url = `/v1/cards/${cardId}`

  return instance.get(url)
}

/**
 * Get Cards
 * @param {String} pageBefore
 * @param {String} pageAfter
 * @param {String} pageSize
 *
 * show cards saved for the user before
 */
export function getCards(
  instance,
  pageBefore: string,
  pageAfter: string,
  pageSize: string,
) {
  const queryParams = {
    pageBefore,
    pageAfter,
    pageSize,
  }

  const url = '/v1/cards'

  return instance.get(url, { params: queryParams })
}

/**
 * Create Card
 * @param {*} payload (contains form data and encrypted card details)
 */
export function createCard(instance, payload: CreateCardDto) {
  const url = '/v1/cards'
  if (payload.metadata) {
    payload.metadata.phoneNumber = nullIfEmpty(payload.metadata.phoneNumber)
  }
  return instance.post(url, payload)
}

/**
 * Update card
 *
 * @param {String} cardId
 * @returns Promise
 */
export function updateCard(instance, cardId: string, payload: UpdateCardDto) {
  return instance.put(`/v1/cards/${cardId}`, payload)
}

/**
 * Create payment
 * @param {*} payload (contains form data and encrypted payment details)
 */
export function createPayment(instance, payload: BasePaymentDto) {
  const url = '/v1/payments'
  if (payload.metadata) {
    payload.metadata.phoneNumber = nullIfEmpty(payload.metadata.phoneNumber)
  }
  return instance.post(url, payload)
}

/**
 * Get a payment
 * @param {String} id
 */
export function getPaymentById(instance, id: string) {
  const url = `/v1/payments/${id}`

  return instance.get(url)
}

/**
 * Get a bank
 * @param {String} id
 */
export function getBankById(instance, id: string) {
  const url = `/v1/banks/wires/${id}`

  return instance.get(url)
}

/**
 * Create an address
 */
export function createAddress(
  instance,
  walletid: string,
  payload: CreateAddressDto,
) {
  const url = `/v1/wallets/${walletid}/addresses`

  return instance.get(url, payload)
}

/**
 * Create an address
 */
export function createBank(instance, payload: CreateBankDto) {
  const url = `/v1/banks/wires`

  return instance.get(url, payload)
}

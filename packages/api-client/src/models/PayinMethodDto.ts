/* tslint:disable */
/* eslint-disable */
/**
 * Passes Backend
 * Get your pass
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime'
/**
 *
 * @export
 * @interface PayinMethodDto
 */
export interface PayinMethodDto {
  /**
   *
   * @type {string}
   * @memberof PayinMethodDto
   */
  method: PayinMethodDtoMethodEnum
  /**
   *
   * @type {string}
   * @memberof PayinMethodDto
   */
  cardId?: string
  /**
   *
   * @type {number}
   * @memberof PayinMethodDto
   */
  chainId?: number
}

/**
 * @export
 */
export const PayinMethodDtoMethodEnum = {
  None: 'none',
  CircleCard: 'circle_card',
  PhantomCircleUsdc: 'phantom_circle_usdc',
  MetamaskCircleUsdc: 'metamask_circle_usdc',
  MetamaskCircleEth: 'metamask_circle_eth',
} as const
export type PayinMethodDtoMethodEnum =
  typeof PayinMethodDtoMethodEnum[keyof typeof PayinMethodDtoMethodEnum]

export function PayinMethodDtoFromJSON(json: any): PayinMethodDto {
  return PayinMethodDtoFromJSONTyped(json, false)
}

export function PayinMethodDtoFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): PayinMethodDto {
  if (json === undefined || json === null) {
    return json
  }
  return {
    method: json['method'],
    cardId: !exists(json, 'cardId') ? undefined : json['cardId'],
    chainId: !exists(json, 'chainId') ? undefined : json['chainId'],
  }
}

export function PayinMethodDtoToJSON(value?: PayinMethodDto | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    method: value.method,
    cardId: value.cardId,
    chainId: value.chainId,
  }
}

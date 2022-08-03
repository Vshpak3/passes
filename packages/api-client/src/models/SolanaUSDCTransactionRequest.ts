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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface SolanaUSDCTransactionRequest
 */
export interface SolanaUSDCTransactionRequest {
    /**
     * 
     * @type {string}
     * @memberof SolanaUSDCTransactionRequest
     */
    paymentId: string;
    /**
     * 
     * @type {string}
     * @memberof SolanaUSDCTransactionRequest
     */
    ownerAccount: string;
}

export function SolanaUSDCTransactionRequestFromJSON(json: any): SolanaUSDCTransactionRequest {
    return SolanaUSDCTransactionRequestFromJSONTyped(json, false);
}

export function SolanaUSDCTransactionRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): SolanaUSDCTransactionRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'paymentId': json['paymentId'],
        'ownerAccount': json['ownerAccount'],
    };
}

export function SolanaUSDCTransactionRequestToJSON(value?: SolanaUSDCTransactionRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'paymentId': value.paymentId,
        'ownerAccount': value.ownerAccount,
    };
}


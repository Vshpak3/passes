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
import type { PayoutMethodDto } from './PayoutMethodDto';
import {
    PayoutMethodDtoFromJSON,
    PayoutMethodDtoFromJSONTyped,
    PayoutMethodDtoToJSON,
} from './PayoutMethodDto';

/**
 * 
 * @export
 * @interface PayoutDto
 */
export interface PayoutDto {
    /**
     * 
     * @type {string}
     * @memberof PayoutDto
     */
    payoutId: string;
    /**
     * 
     * @type {PayoutMethodDto}
     * @memberof PayoutDto
     */
    payoutMethod: PayoutMethodDto;
    /**
     * 
     * @type {string}
     * @memberof PayoutDto
     */
    payoutStatus: PayoutDtoPayoutStatusEnum;
    /**
     * 
     * @type {number}
     * @memberof PayoutDto
     */
    amount: number;
    /**
     * 
     * @type {Date}
     * @memberof PayoutDto
     */
    createdAt: Date;
    /**
     * 
     * @type {string}
     * @memberof PayoutDto
     */
    transactionHash?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PayoutDto
     */
    bankDescription?: string;
    /**
     * 
     * @type {string}
     * @memberof PayoutDto
     */
    address?: string;
    /**
     * 
     * @type {string}
     * @memberof PayoutDto
     */
    chain?: PayoutDtoChainEnum;
}


/**
 * @export
 */
export const PayoutDtoPayoutStatusEnum = {
    Created: 'created',
    Pending: 'pending',
    Successful: 'successful',
    Failed: 'failed'
} as const;
export type PayoutDtoPayoutStatusEnum = typeof PayoutDtoPayoutStatusEnum[keyof typeof PayoutDtoPayoutStatusEnum];

/**
 * @export
 */
export const PayoutDtoChainEnum = {
    Eth: 'eth',
    Sol: 'sol',
    Avax: 'avax',
    Matic: 'matic'
} as const;
export type PayoutDtoChainEnum = typeof PayoutDtoChainEnum[keyof typeof PayoutDtoChainEnum];


/**
 * Check if a given object implements the PayoutDto interface.
 */
export function instanceOfPayoutDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "payoutId" in value;
    isInstance = isInstance && "payoutMethod" in value;
    isInstance = isInstance && "payoutStatus" in value;
    isInstance = isInstance && "amount" in value;
    isInstance = isInstance && "createdAt" in value;

    return isInstance;
}

export function PayoutDtoFromJSON(json: any): PayoutDto {
    return PayoutDtoFromJSONTyped(json, false);
}

export function PayoutDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PayoutDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'payoutId': json['payoutId'],
        'payoutMethod': PayoutMethodDtoFromJSON(json['payoutMethod']),
        'payoutStatus': json['payoutStatus'],
        'amount': json['amount'],
        'createdAt': (new Date(json['createdAt'])),
        'transactionHash': !exists(json, 'transactionHash') ? undefined : json['transactionHash'],
        'bankDescription': !exists(json, 'bank_description') ? undefined : json['bank_description'],
        'address': !exists(json, 'address') ? undefined : json['address'],
        'chain': !exists(json, 'chain') ? undefined : json['chain'],
    };
}

export function PayoutDtoToJSON(value?: PayoutDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'payoutId': value.payoutId,
        'payoutMethod': PayoutMethodDtoToJSON(value.payoutMethod),
        'payoutStatus': value.payoutStatus,
        'amount': value.amount,
        'createdAt': (value.createdAt.toISOString()),
        'transactionHash': value.transactionHash,
        'bank_description': value.bankDescription,
        'address': value.address,
        'chain': value.chain,
    };
}


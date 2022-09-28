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
import type { CircleBankDto } from './CircleBankDto';
import {
    CircleBankDtoFromJSON,
    CircleBankDtoFromJSONTyped,
    CircleBankDtoToJSON,
} from './CircleBankDto';
import type { PayoutMethodDto } from './PayoutMethodDto';
import {
    PayoutMethodDtoFromJSON,
    PayoutMethodDtoFromJSONTyped,
    PayoutMethodDtoToJSON,
} from './PayoutMethodDto';
import type { WalletDto } from './WalletDto';
import {
    WalletDtoFromJSON,
    WalletDtoFromJSONTyped,
    WalletDtoToJSON,
} from './WalletDto';

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
    id: string;
    /**
     * 
     * @type {string}
     * @memberof PayoutDto
     */
    userId: string;
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
     * @type {CircleBankDto}
     * @memberof PayoutDto
     */
    bank?: CircleBankDto;
    /**
     * 
     * @type {WalletDto}
     * @memberof PayoutDto
     */
    wallet?: WalletDto;
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
 * Check if a given object implements the PayoutDto interface.
 */
export function instanceOfPayoutDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "userId" in value;
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
        
        'id': json['id'],
        'userId': json['userId'],
        'payoutMethod': PayoutMethodDtoFromJSON(json['payoutMethod']),
        'payoutStatus': json['payoutStatus'],
        'amount': json['amount'],
        'createdAt': json['createdAt'],
        'transactionHash': !exists(json, 'transactionHash') ? undefined : json['transactionHash'],
        'bank': !exists(json, 'bank') ? undefined : CircleBankDtoFromJSON(json['bank']),
        'wallet': !exists(json, 'wallet') ? undefined : WalletDtoFromJSON(json['wallet']),
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
        
        'id': value.id,
        'userId': value.userId,
        'payoutMethod': PayoutMethodDtoToJSON(value.payoutMethod),
        'payoutStatus': value.payoutStatus,
        'amount': value.amount,
        'createdAt': value.createdAt,
        'transactionHash': value.transactionHash,
        'bank': CircleBankDtoToJSON(value.bank),
        'wallet': WalletDtoToJSON(value.wallet),
    };
}


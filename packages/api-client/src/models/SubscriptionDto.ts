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
import {
    CircleCardDto,
    CircleCardDtoFromJSON,
    CircleCardDtoFromJSONTyped,
    CircleCardDtoToJSON,
} from './CircleCardDto';
import {
    GetPassDto,
    GetPassDtoFromJSON,
    GetPassDtoFromJSONTyped,
    GetPassDtoToJSON,
} from './GetPassDto';
import {
    GetPassOwnershipDto,
    GetPassOwnershipDtoFromJSON,
    GetPassOwnershipDtoFromJSONTyped,
    GetPassOwnershipDtoToJSON,
} from './GetPassOwnershipDto';
import {
    PayinMethodDto,
    PayinMethodDtoFromJSON,
    PayinMethodDtoFromJSONTyped,
    PayinMethodDtoToJSON,
} from './PayinMethodDto';

/**
 * 
 * @export
 * @interface SubscriptionDto
 */
export interface SubscriptionDto {
    /**
     * 
     * @type {string}
     * @memberof SubscriptionDto
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof SubscriptionDto
     */
    userId: string;
    /**
     * 
     * @type {PayinMethodDto}
     * @memberof SubscriptionDto
     */
    payinMethod: PayinMethodDto;
    /**
     * 
     * @type {string}
     * @memberof SubscriptionDto
     */
    subscriptionStatus: SubscriptionDtoSubscriptionStatusEnum;
    /**
     * 
     * @type {number}
     * @memberof SubscriptionDto
     */
    amount: number;
    /**
     * 
     * @type {CircleCardDto}
     * @memberof SubscriptionDto
     */
    card?: CircleCardDto;
    /**
     * 
     * @type {string}
     * @memberof SubscriptionDto
     */
    passOwnershipId?: string;
    /**
     * 
     * @type {GetPassOwnershipDto}
     * @memberof SubscriptionDto
     */
    passOwnership?: GetPassOwnershipDto;
    /**
     * 
     * @type {GetPassDto}
     * @memberof SubscriptionDto
     */
    pass?: GetPassDto;
}


/**
 * @export
 */
export const SubscriptionDtoSubscriptionStatusEnum = {
    Active: 'active',
    Expiring: 'expiring',
    Disabled: 'disabled',
    Cancelled: 'cancelled'
} as const;
export type SubscriptionDtoSubscriptionStatusEnum = typeof SubscriptionDtoSubscriptionStatusEnum[keyof typeof SubscriptionDtoSubscriptionStatusEnum];


export function SubscriptionDtoFromJSON(json: any): SubscriptionDto {
    return SubscriptionDtoFromJSONTyped(json, false);
}

export function SubscriptionDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SubscriptionDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'userId': json['userId'],
        'payinMethod': PayinMethodDtoFromJSON(json['payinMethod']),
        'subscriptionStatus': json['subscriptionStatus'],
        'amount': json['amount'],
        'card': !exists(json, 'card') ? undefined : CircleCardDtoFromJSON(json['card']),
        'passOwnershipId': !exists(json, 'passOwnershipId') ? undefined : json['passOwnershipId'],
        'passOwnership': !exists(json, 'passOwnership') ? undefined : GetPassOwnershipDtoFromJSON(json['passOwnership']),
        'pass': !exists(json, 'pass') ? undefined : GetPassDtoFromJSON(json['pass']),
    };
}

export function SubscriptionDtoToJSON(value?: SubscriptionDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'userId': value.userId,
        'payinMethod': PayinMethodDtoToJSON(value.payinMethod),
        'subscriptionStatus': value.subscriptionStatus,
        'amount': value.amount,
        'card': CircleCardDtoToJSON(value.card),
        'passOwnershipId': value.passOwnershipId,
        'passOwnership': GetPassOwnershipDtoToJSON(value.passOwnership),
        'pass': GetPassDtoToJSON(value.pass),
    };
}


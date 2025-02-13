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
 * @interface PayinDataDto
 */
export interface PayinDataDto {
    /**
     * 
     * @type {number}
     * @memberof PayinDataDto
     */
    amount: number;
    /**
     * 
     * @type {number}
     * @memberof PayinDataDto
     */
    amountEth?: number;
    /**
     * 
     * @type {string}
     * @memberof PayinDataDto
     */
    target?: string;
    /**
     * 
     * @type {string}
     * @memberof PayinDataDto
     */
    blocked?: PayinDataDtoBlockedEnum;
}


/**
 * @export
 */
export const PayinDataDtoBlockedEnum = {
    PaymentsDeactivated: 'payments deactivated',
    NoPayinMethod: 'no payin method',
    NoPrice: 'no price',
    PurchaseInProgress: 'purchase in progress',
    TooManyPurchasesInProgress: 'too many purchases in progress',
    AlreadyHasAccess: 'already has access',
    IsNotPassholder: 'is not passholder',
    AlreadyOwnsPass: 'already owns pass',
    UserBlocked: 'user blocked',
    InsufficientTip: 'insufficient tip',
    InsufficientSupply: 'insufficient supply',
    DoesNotFollow: 'does not follow',
    WaitingForRedirect: 'waiting for redirect'
} as const;
export type PayinDataDtoBlockedEnum = typeof PayinDataDtoBlockedEnum[keyof typeof PayinDataDtoBlockedEnum];


/**
 * Check if a given object implements the PayinDataDto interface.
 */
export function instanceOfPayinDataDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "amount" in value;

    return isInstance;
}

export function PayinDataDtoFromJSON(json: any): PayinDataDto {
    return PayinDataDtoFromJSONTyped(json, false);
}

export function PayinDataDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PayinDataDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'amount': json['amount'],
        'amountEth': !exists(json, 'amountEth') ? undefined : json['amountEth'],
        'target': !exists(json, 'target') ? undefined : json['target'],
        'blocked': !exists(json, 'blocked') ? undefined : json['blocked'],
    };
}

export function PayinDataDtoToJSON(value?: PayinDataDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'amount': value.amount,
        'amountEth': value.amountEth,
        'target': value.target,
        'blocked': value.blocked,
    };
}


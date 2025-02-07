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
 * @interface PayoutMethodDto
 */
export interface PayoutMethodDto {
    /**
     * 
     * @type {string}
     * @memberof PayoutMethodDto
     */
    method: PayoutMethodDtoMethodEnum;
    /**
     * 
     * @type {string}
     * @memberof PayoutMethodDto
     */
    bankId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PayoutMethodDto
     */
    walletId?: string | null;
}


/**
 * @export
 */
export const PayoutMethodDtoMethodEnum = {
    None: 'none',
    CircleWire: 'circle_wire',
    CircleUsdc: 'circle_usdc'
} as const;
export type PayoutMethodDtoMethodEnum = typeof PayoutMethodDtoMethodEnum[keyof typeof PayoutMethodDtoMethodEnum];


/**
 * Check if a given object implements the PayoutMethodDto interface.
 */
export function instanceOfPayoutMethodDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "method" in value;

    return isInstance;
}

export function PayoutMethodDtoFromJSON(json: any): PayoutMethodDto {
    return PayoutMethodDtoFromJSONTyped(json, false);
}

export function PayoutMethodDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PayoutMethodDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'method': json['method'],
        'bankId': !exists(json, 'bankId') ? undefined : json['bankId'],
        'walletId': !exists(json, 'walletId') ? undefined : json['walletId'],
    };
}

export function PayoutMethodDtoToJSON(value?: PayoutMethodDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'method': value.method,
        'bankId': value.bankId,
        'walletId': value.walletId,
    };
}


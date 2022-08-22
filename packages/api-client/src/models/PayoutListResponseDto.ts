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
    PayoutDto,
    PayoutDtoFromJSON,
    PayoutDtoFromJSONTyped,
    PayoutDtoToJSON,
} from './PayoutDto';

/**
 * 
 * @export
 * @interface PayoutListResponseDto
 */
export interface PayoutListResponseDto {
    /**
     * 
     * @type {number}
     * @memberof PayoutListResponseDto
     */
    count: number;
    /**
     * 
     * @type {Array<PayoutDto>}
     * @memberof PayoutListResponseDto
     */
    payouts: Array<PayoutDto>;
}

export function PayoutListResponseDtoFromJSON(json: any): PayoutListResponseDto {
    return PayoutListResponseDtoFromJSONTyped(json, false);
}

export function PayoutListResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PayoutListResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'count': json['count'],
        'payouts': ((json['payouts'] as Array<any>).map(PayoutDtoFromJSON)),
    };
}

export function PayoutListResponseDtoToJSON(value?: PayoutListResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'count': value.count,
        'payouts': ((value.payouts as Array<any>).map(PayoutDtoToJSON)),
    };
}


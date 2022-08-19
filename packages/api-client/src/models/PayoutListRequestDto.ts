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
 * @interface PayoutListRequestDto
 */
export interface PayoutListRequestDto {
    /**
     * 
     * @type {number}
     * @memberof PayoutListRequestDto
     */
    offset: number;
    /**
     * 
     * @type {number}
     * @memberof PayoutListRequestDto
     */
    limit: number;
}

export function PayoutListRequestDtoFromJSON(json: any): PayoutListRequestDto {
    return PayoutListRequestDtoFromJSONTyped(json, false);
}

export function PayoutListRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PayoutListRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'offset': json['offset'],
        'limit': json['limit'],
    };
}

export function PayoutListRequestDtoToJSON(value?: PayoutListRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'offset': value.offset,
        'limit': value.limit,
    };
}


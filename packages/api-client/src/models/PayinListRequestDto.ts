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
 * @interface PayinListRequestDto
 */
export interface PayinListRequestDto {
    /**
     * 
     * @type {number}
     * @memberof PayinListRequestDto
     */
    offset: number;
    /**
     * 
     * @type {number}
     * @memberof PayinListRequestDto
     */
    limit: number;
}

export function PayinListRequestDtoFromJSON(json: any): PayinListRequestDto {
    return PayinListRequestDtoFromJSONTyped(json, false);
}

export function PayinListRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PayinListRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'offset': json['offset'],
        'limit': json['limit'],
    };
}

export function PayinListRequestDtoToJSON(value?: PayinListRequestDto | null): any {
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


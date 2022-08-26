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
 * @interface GetChannelStatResponseDto
 */
export interface GetChannelStatResponseDto {
    /**
     * 
     * @type {string}
     * @memberof GetChannelStatResponseDto
     */
    id: string;
    /**
     * 
     * @type {number}
     * @memberof GetChannelStatResponseDto
     */
    totalTipAmount: number;
}

export function GetChannelStatResponseDtoFromJSON(json: any): GetChannelStatResponseDto {
    return GetChannelStatResponseDtoFromJSONTyped(json, false);
}

export function GetChannelStatResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetChannelStatResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'totalTipAmount': json['totalTipAmount'],
    };
}

export function GetChannelStatResponseDtoToJSON(value?: GetChannelStatResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'totalTipAmount': value.totalTipAmount,
    };
}


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
 * @interface GetChannelStatsRequestDto
 */
export interface GetChannelStatsRequestDto {
    /**
     * 
     * @type {Array<string>}
     * @memberof GetChannelStatsRequestDto
     */
    channelIds: Array<string>;
}

export function GetChannelStatsRequestDtoFromJSON(json: any): GetChannelStatsRequestDto {
    return GetChannelStatsRequestDtoFromJSONTyped(json, false);
}

export function GetChannelStatsRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetChannelStatsRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'channelIds': json['channelIds'],
    };
}

export function GetChannelStatsRequestDtoToJSON(value?: GetChannelStatsRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'channelIds': value.channelIds,
    };
}


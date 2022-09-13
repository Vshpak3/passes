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
import type { ChannelStatDto } from './ChannelStatDto';
import {
    ChannelStatDtoFromJSON,
    ChannelStatDtoFromJSONTyped,
    ChannelStatDtoToJSON,
} from './ChannelStatDto';

/**
 * 
 * @export
 * @interface GetChannelStatsResponseDto
 */
export interface GetChannelStatsResponseDto {
    /**
     * 
     * @type {Array<ChannelStatDto>}
     * @memberof GetChannelStatsResponseDto
     */
    channelStats: Array<ChannelStatDto>;
}

/**
 * Check if a given object implements the GetChannelStatsResponseDto interface.
 */
export function instanceOfGetChannelStatsResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "channelStats" in value;

    return isInstance;
}

export function GetChannelStatsResponseDtoFromJSON(json: any): GetChannelStatsResponseDto {
    return GetChannelStatsResponseDtoFromJSONTyped(json, false);
}

export function GetChannelStatsResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetChannelStatsResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'channelStats': ((json['channelStats'] as Array<any>).map(ChannelStatDtoFromJSON)),
    };
}

export function GetChannelStatsResponseDtoToJSON(value?: GetChannelStatsResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'channelStats': ((value.channelStats as Array<any>).map(ChannelStatDtoToJSON)),
    };
}


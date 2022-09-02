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
 * @interface ChannelStatDto
 */
export interface ChannelStatDto {
    /**
     * 
     * @type {string}
     * @memberof ChannelStatDto
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof ChannelStatDto
     */
    channelId: string;
    /**
     * 
     * @type {number}
     * @memberof ChannelStatDto
     */
    totalTipAmount: number;
    /**
     * 
     * @type {boolean}
     * @memberof ChannelStatDto
     */
    blocked: boolean;
}

export function ChannelStatDtoFromJSON(json: any): ChannelStatDto {
    return ChannelStatDtoFromJSONTyped(json, false);
}

export function ChannelStatDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChannelStatDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'channelId': json['channelId'],
        'totalTipAmount': json['totalTipAmount'],
        'blocked': json['blocked'],
    };
}

export function ChannelStatDtoToJSON(value?: ChannelStatDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'channelId': value.channelId,
        'totalTipAmount': value.totalTipAmount,
        'blocked': value.blocked,
    };
}


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
import type { ChannelMemberDto } from './ChannelMemberDto';
import {
    ChannelMemberDtoFromJSON,
    ChannelMemberDtoFromJSONTyped,
    ChannelMemberDtoToJSON,
} from './ChannelMemberDto';

/**
 * 
 * @export
 * @interface GetChannelsResponseDto
 */
export interface GetChannelsResponseDto {
    /**
     * 
     * @type {string}
     * @memberof GetChannelsResponseDto
     */
    lastId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetChannelsResponseDto
     */
    search?: string;
    /**
     * 
     * @type {string}
     * @memberof GetChannelsResponseDto
     */
    order: GetChannelsResponseDtoOrderEnum;
    /**
     * 
     * @type {number}
     * @memberof GetChannelsResponseDto
     */
    spent?: number | null;
    /**
     * 
     * @type {Date}
     * @memberof GetChannelsResponseDto
     */
    recent?: Date;
    /**
     * 
     * @type {number}
     * @memberof GetChannelsResponseDto
     */
    tip?: number;
    /**
     * 
     * @type {string}
     * @memberof GetChannelsResponseDto
     */
    orderType: GetChannelsResponseDtoOrderTypeEnum;
    /**
     * 
     * @type {boolean}
     * @memberof GetChannelsResponseDto
     */
    unreadOnly: boolean;
    /**
     * 
     * @type {Array<ChannelMemberDto>}
     * @memberof GetChannelsResponseDto
     */
    data: Array<ChannelMemberDto>;
}


/**
 * @export
 */
export const GetChannelsResponseDtoOrderEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type GetChannelsResponseDtoOrderEnum = typeof GetChannelsResponseDtoOrderEnum[keyof typeof GetChannelsResponseDtoOrderEnum];

/**
 * @export
 */
export const GetChannelsResponseDtoOrderTypeEnum = {
    Recent: 'recent',
    Tip: 'tip',
    Spent: 'spent'
} as const;
export type GetChannelsResponseDtoOrderTypeEnum = typeof GetChannelsResponseDtoOrderTypeEnum[keyof typeof GetChannelsResponseDtoOrderTypeEnum];


/**
 * Check if a given object implements the GetChannelsResponseDto interface.
 */
export function instanceOfGetChannelsResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "order" in value;
    isInstance = isInstance && "orderType" in value;
    isInstance = isInstance && "unreadOnly" in value;
    isInstance = isInstance && "data" in value;

    return isInstance;
}

export function GetChannelsResponseDtoFromJSON(json: any): GetChannelsResponseDto {
    return GetChannelsResponseDtoFromJSONTyped(json, false);
}

export function GetChannelsResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetChannelsResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'lastId': !exists(json, 'lastId') ? undefined : json['lastId'],
        'search': !exists(json, 'search') ? undefined : json['search'],
        'order': json['order'],
        'spent': !exists(json, 'spent') ? undefined : json['spent'],
        'recent': !exists(json, 'recent') ? undefined : (new Date(json['recent'])),
        'tip': !exists(json, 'tip') ? undefined : json['tip'],
        'orderType': json['orderType'],
        'unreadOnly': json['unreadOnly'],
        'data': ((json['data'] as Array<any>).map(ChannelMemberDtoFromJSON)),
    };
}

export function GetChannelsResponseDtoToJSON(value?: GetChannelsResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'lastId': value.lastId,
        'search': value.search,
        'order': value.order,
        'spent': value.spent,
        'recent': value.recent === undefined ? undefined : (value.recent.toISOString()),
        'tip': value.tip,
        'orderType': value.orderType,
        'unreadOnly': value.unreadOnly,
        'data': ((value.data as Array<any>).map(ChannelMemberDtoToJSON)),
    };
}


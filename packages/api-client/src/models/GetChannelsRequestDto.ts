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
 * @interface GetChannelsRequestDto
 */
export interface GetChannelsRequestDto {
    /**
     * 
     * @type {string}
     * @memberof GetChannelsRequestDto
     */
    lastId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetChannelsRequestDto
     */
    search?: string;
    /**
     * 
     * @type {string}
     * @memberof GetChannelsRequestDto
     */
    order: string;
    /**
     * 
     * @type {Date}
     * @memberof GetChannelsRequestDto
     */
    recent?: Date;
    /**
     * 
     * @type {number}
     * @memberof GetChannelsRequestDto
     */
    tip?: number;
    /**
     * 
     * @type {string}
     * @memberof GetChannelsRequestDto
     */
    orderType: GetChannelsRequestDtoOrderTypeEnum;
    /**
     * 
     * @type {boolean}
     * @memberof GetChannelsRequestDto
     */
    unreadOnly: boolean;
}


/**
 * @export
 */
export const GetChannelsRequestDtoOrderTypeEnum = {
    Recent: 'recent',
    Tip: 'tip'
} as const;
export type GetChannelsRequestDtoOrderTypeEnum = typeof GetChannelsRequestDtoOrderTypeEnum[keyof typeof GetChannelsRequestDtoOrderTypeEnum];


/**
 * Check if a given object implements the GetChannelsRequestDto interface.
 */
export function instanceOfGetChannelsRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "order" in value;
    isInstance = isInstance && "orderType" in value;
    isInstance = isInstance && "unreadOnly" in value;

    return isInstance;
}

export function GetChannelsRequestDtoFromJSON(json: any): GetChannelsRequestDto {
    return GetChannelsRequestDtoFromJSONTyped(json, false);
}

export function GetChannelsRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetChannelsRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'lastId': !exists(json, 'lastId') ? undefined : json['lastId'],
        'search': !exists(json, 'search') ? undefined : json['search'],
        'order': json['order'],
        'recent': !exists(json, 'recent') ? undefined : json['recent'],
        'tip': !exists(json, 'tip') ? undefined : json['tip'],
        'orderType': json['orderType'],
        'unreadOnly': json['unreadOnly'],
    };
}

export function GetChannelsRequestDtoToJSON(value?: GetChannelsRequestDto | null): any {
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
        'recent': value.recent,
        'tip': value.tip,
        'orderType': value.orderType,
        'unreadOnly': value.unreadOnly,
    };
}


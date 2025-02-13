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
 * @interface GetPassesRequestDto
 */
export interface GetPassesRequestDto {
    /**
     * 
     * @type {Date}
     * @memberof GetPassesRequestDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof GetPassesRequestDto
     */
    lastId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassesRequestDto
     */
    search?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassesRequestDto
     */
    order: GetPassesRequestDtoOrderEnum;
    /**
     * 
     * @type {boolean}
     * @memberof GetPassesRequestDto
     */
    pinned?: boolean;
    /**
     * 
     * @type {Date}
     * @memberof GetPassesRequestDto
     */
    pinnedAt?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof GetPassesRequestDto
     */
    creatorId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassesRequestDto
     */
    type?: GetPassesRequestDtoTypeEnum;
    /**
     * 
     * @type {number}
     * @memberof GetPassesRequestDto
     */
    price?: number;
    /**
     * 
     * @type {string}
     * @memberof GetPassesRequestDto
     */
    orderType: GetPassesRequestDtoOrderTypeEnum;
}


/**
 * @export
 */
export const GetPassesRequestDtoOrderEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type GetPassesRequestDtoOrderEnum = typeof GetPassesRequestDtoOrderEnum[keyof typeof GetPassesRequestDtoOrderEnum];

/**
 * @export
 */
export const GetPassesRequestDtoTypeEnum = {
    Subscription: 'subscription',
    Lifetime: 'lifetime',
    External: 'external'
} as const;
export type GetPassesRequestDtoTypeEnum = typeof GetPassesRequestDtoTypeEnum[keyof typeof GetPassesRequestDtoTypeEnum];

/**
 * @export
 */
export const GetPassesRequestDtoOrderTypeEnum = {
    Price: 'price',
    CreatedAt: 'created at',
    PinnedAt: 'pinned at'
} as const;
export type GetPassesRequestDtoOrderTypeEnum = typeof GetPassesRequestDtoOrderTypeEnum[keyof typeof GetPassesRequestDtoOrderTypeEnum];


/**
 * Check if a given object implements the GetPassesRequestDto interface.
 */
export function instanceOfGetPassesRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "order" in value;
    isInstance = isInstance && "orderType" in value;

    return isInstance;
}

export function GetPassesRequestDtoFromJSON(json: any): GetPassesRequestDto {
    return GetPassesRequestDtoFromJSONTyped(json, false);
}

export function GetPassesRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetPassesRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'lastId': !exists(json, 'lastId') ? undefined : json['lastId'],
        'search': !exists(json, 'search') ? undefined : json['search'],
        'order': json['order'],
        'pinned': !exists(json, 'pinned') ? undefined : json['pinned'],
        'pinnedAt': !exists(json, 'pinnedAt') ? undefined : (json['pinnedAt'] === null ? null : new Date(json['pinnedAt'])),
        'creatorId': !exists(json, 'creatorId') ? undefined : json['creatorId'],
        'type': !exists(json, 'type') ? undefined : json['type'],
        'price': !exists(json, 'price') ? undefined : json['price'],
        'orderType': json['orderType'],
    };
}

export function GetPassesRequestDtoToJSON(value?: GetPassesRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'createdAt': value.createdAt === undefined ? undefined : (value.createdAt.toISOString()),
        'lastId': value.lastId,
        'search': value.search,
        'order': value.order,
        'pinned': value.pinned,
        'pinnedAt': value.pinnedAt === undefined ? undefined : (value.pinnedAt === null ? null : value.pinnedAt.toISOString()),
        'creatorId': value.creatorId,
        'type': value.type,
        'price': value.price,
        'orderType': value.orderType,
    };
}


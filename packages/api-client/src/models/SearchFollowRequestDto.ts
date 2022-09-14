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
 * @interface SearchFollowRequestDto
 */
export interface SearchFollowRequestDto {
    /**
     * 
     * @type {Date}
     * @memberof SearchFollowRequestDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof SearchFollowRequestDto
     */
    lastId?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchFollowRequestDto
     */
    search?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchFollowRequestDto
     */
    order: string;
    /**
     * 
     * @type {string}
     * @memberof SearchFollowRequestDto
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchFollowRequestDto
     */
    displayName?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchFollowRequestDto
     */
    orderType: SearchFollowRequestDtoOrderTypeEnum;
}


/**
 * @export
 */
export const SearchFollowRequestDtoOrderTypeEnum = {
    Username: 'username',
    DisplayName: 'display name',
    CreatedAt: 'created at'
} as const;
export type SearchFollowRequestDtoOrderTypeEnum = typeof SearchFollowRequestDtoOrderTypeEnum[keyof typeof SearchFollowRequestDtoOrderTypeEnum];


/**
 * Check if a given object implements the SearchFollowRequestDto interface.
 */
export function instanceOfSearchFollowRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "order" in value;
    isInstance = isInstance && "orderType" in value;

    return isInstance;
}

export function SearchFollowRequestDtoFromJSON(json: any): SearchFollowRequestDto {
    return SearchFollowRequestDtoFromJSONTyped(json, false);
}

export function SearchFollowRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchFollowRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'lastId': !exists(json, 'lastId') ? undefined : json['lastId'],
        'search': !exists(json, 'search') ? undefined : json['search'],
        'order': json['order'],
        'username': !exists(json, 'username') ? undefined : json['username'],
        'displayName': !exists(json, 'displayName') ? undefined : json['displayName'],
        'orderType': json['orderType'],
    };
}

export function SearchFollowRequestDtoToJSON(value?: SearchFollowRequestDto | null): any {
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
        'username': value.username,
        'displayName': value.displayName,
        'orderType': value.orderType,
    };
}


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
import type { ListMemberDto } from './ListMemberDto';
import {
    ListMemberDtoFromJSON,
    ListMemberDtoFromJSONTyped,
    ListMemberDtoToJSON,
} from './ListMemberDto';

/**
 * 
 * @export
 * @interface SearchFollowingResponseDto
 */
export interface SearchFollowingResponseDto {
    /**
     * 
     * @type {Date}
     * @memberof SearchFollowingResponseDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof SearchFollowingResponseDto
     */
    lastId?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchFollowingResponseDto
     */
    search?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchFollowingResponseDto
     */
    order: SearchFollowingResponseDtoOrderEnum;
    /**
     * 
     * @type {number}
     * @memberof SearchFollowingResponseDto
     */
    spent?: number | null;
    /**
     * 
     * @type {string}
     * @memberof SearchFollowingResponseDto
     */
    listId: string;
    /**
     * 
     * @type {string}
     * @memberof SearchFollowingResponseDto
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchFollowingResponseDto
     */
    displayName?: string | null;
    /**
     * 
     * @type {number}
     * @memberof SearchFollowingResponseDto
     */
    metadataNumber?: number | null;
    /**
     * 
     * @type {string}
     * @memberof SearchFollowingResponseDto
     */
    orderType: SearchFollowingResponseDtoOrderTypeEnum;
    /**
     * 
     * @type {Array<ListMemberDto>}
     * @memberof SearchFollowingResponseDto
     */
    data: Array<ListMemberDto>;
}


/**
 * @export
 */
export const SearchFollowingResponseDtoOrderEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type SearchFollowingResponseDtoOrderEnum = typeof SearchFollowingResponseDtoOrderEnum[keyof typeof SearchFollowingResponseDtoOrderEnum];

/**
 * @export
 */
export const SearchFollowingResponseDtoOrderTypeEnum = {
    Username: 'username',
    DisplayName: 'display name',
    CreatedAt: 'created at',
    Spent: 'spent',
    Metadata: 'metadata'
} as const;
export type SearchFollowingResponseDtoOrderTypeEnum = typeof SearchFollowingResponseDtoOrderTypeEnum[keyof typeof SearchFollowingResponseDtoOrderTypeEnum];


/**
 * Check if a given object implements the SearchFollowingResponseDto interface.
 */
export function instanceOfSearchFollowingResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "order" in value;
    isInstance = isInstance && "listId" in value;
    isInstance = isInstance && "orderType" in value;
    isInstance = isInstance && "data" in value;

    return isInstance;
}

export function SearchFollowingResponseDtoFromJSON(json: any): SearchFollowingResponseDto {
    return SearchFollowingResponseDtoFromJSONTyped(json, false);
}

export function SearchFollowingResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchFollowingResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'lastId': !exists(json, 'lastId') ? undefined : json['lastId'],
        'search': !exists(json, 'search') ? undefined : json['search'],
        'order': json['order'],
        'spent': !exists(json, 'spent') ? undefined : json['spent'],
        'listId': json['listId'],
        'username': !exists(json, 'username') ? undefined : json['username'],
        'displayName': !exists(json, 'displayName') ? undefined : json['displayName'],
        'metadataNumber': !exists(json, 'metadataNumber') ? undefined : json['metadataNumber'],
        'orderType': json['orderType'],
        'data': ((json['data'] as Array<any>).map(ListMemberDtoFromJSON)),
    };
}

export function SearchFollowingResponseDtoToJSON(value?: SearchFollowingResponseDto | null): any {
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
        'spent': value.spent,
        'listId': value.listId,
        'username': value.username,
        'displayName': value.displayName,
        'metadataNumber': value.metadataNumber,
        'orderType': value.orderType,
        'data': ((value.data as Array<any>).map(ListMemberDtoToJSON)),
    };
}


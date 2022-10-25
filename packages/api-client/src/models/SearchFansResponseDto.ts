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
 * @interface SearchFansResponseDto
 */
export interface SearchFansResponseDto {
    /**
     * 
     * @type {Date}
     * @memberof SearchFansResponseDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof SearchFansResponseDto
     */
    lastId?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchFansResponseDto
     */
    search?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchFansResponseDto
     */
    order: SearchFansResponseDtoOrderEnum;
    /**
     * 
     * @type {string}
     * @memberof SearchFansResponseDto
     */
    listId: string;
    /**
     * 
     * @type {string}
     * @memberof SearchFansResponseDto
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchFansResponseDto
     */
    displayName?: string | null;
    /**
     * 
     * @type {number}
     * @memberof SearchFansResponseDto
     */
    metadataNumber?: number;
    /**
     * 
     * @type {string}
     * @memberof SearchFansResponseDto
     */
    orderType: SearchFansResponseDtoOrderTypeEnum;
    /**
     * 
     * @type {Array<ListMemberDto>}
     * @memberof SearchFansResponseDto
     */
    data: Array<ListMemberDto>;
}


/**
 * @export
 */
export const SearchFansResponseDtoOrderEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type SearchFansResponseDtoOrderEnum = typeof SearchFansResponseDtoOrderEnum[keyof typeof SearchFansResponseDtoOrderEnum];

/**
 * @export
 */
export const SearchFansResponseDtoOrderTypeEnum = {
    Username: 'username',
    DisplayName: 'display name',
    CreatedAt: 'created at',
    Metadata: 'metadata'
} as const;
export type SearchFansResponseDtoOrderTypeEnum = typeof SearchFansResponseDtoOrderTypeEnum[keyof typeof SearchFansResponseDtoOrderTypeEnum];


/**
 * Check if a given object implements the SearchFansResponseDto interface.
 */
export function instanceOfSearchFansResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "order" in value;
    isInstance = isInstance && "listId" in value;
    isInstance = isInstance && "orderType" in value;
    isInstance = isInstance && "data" in value;

    return isInstance;
}

export function SearchFansResponseDtoFromJSON(json: any): SearchFansResponseDto {
    return SearchFansResponseDtoFromJSONTyped(json, false);
}

export function SearchFansResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchFansResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'lastId': !exists(json, 'lastId') ? undefined : json['lastId'],
        'search': !exists(json, 'search') ? undefined : json['search'],
        'order': json['order'],
        'listId': json['listId'],
        'username': !exists(json, 'username') ? undefined : json['username'],
        'displayName': !exists(json, 'displayName') ? undefined : json['displayName'],
        'metadataNumber': !exists(json, 'metadataNumber') ? undefined : json['metadataNumber'],
        'orderType': json['orderType'],
        'data': ((json['data'] as Array<any>).map(ListMemberDtoFromJSON)),
    };
}

export function SearchFansResponseDtoToJSON(value?: SearchFansResponseDto | null): any {
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
        'listId': value.listId,
        'username': value.username,
        'displayName': value.displayName,
        'metadataNumber': value.metadataNumber,
        'orderType': value.orderType,
        'data': ((value.data as Array<any>).map(ListMemberDtoToJSON)),
    };
}


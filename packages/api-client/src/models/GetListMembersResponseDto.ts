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
 * @interface GetListMembersResponseDto
 */
export interface GetListMembersResponseDto {
    /**
     * 
     * @type {Date}
     * @memberof GetListMembersResponseDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof GetListMembersResponseDto
     */
    lastId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetListMembersResponseDto
     */
    search?: string;
    /**
     * 
     * @type {string}
     * @memberof GetListMembersResponseDto
     */
    order: GetListMembersResponseDtoOrderEnum;
    /**
     * 
     * @type {string}
     * @memberof GetListMembersResponseDto
     */
    listId: string;
    /**
     * 
     * @type {string}
     * @memberof GetListMembersResponseDto
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof GetListMembersResponseDto
     */
    displayName?: string | null;
    /**
     * 
     * @type {number}
     * @memberof GetListMembersResponseDto
     */
    metadataNumber?: number | null;
    /**
     * 
     * @type {string}
     * @memberof GetListMembersResponseDto
     */
    orderType: GetListMembersResponseDtoOrderTypeEnum;
    /**
     * 
     * @type {Array<ListMemberDto>}
     * @memberof GetListMembersResponseDto
     */
    data: Array<ListMemberDto>;
}


/**
 * @export
 */
export const GetListMembersResponseDtoOrderEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type GetListMembersResponseDtoOrderEnum = typeof GetListMembersResponseDtoOrderEnum[keyof typeof GetListMembersResponseDtoOrderEnum];

/**
 * @export
 */
export const GetListMembersResponseDtoOrderTypeEnum = {
    Username: 'username',
    DisplayName: 'display name',
    CreatedAt: 'created at',
    Metadata: 'metadata'
} as const;
export type GetListMembersResponseDtoOrderTypeEnum = typeof GetListMembersResponseDtoOrderTypeEnum[keyof typeof GetListMembersResponseDtoOrderTypeEnum];


/**
 * Check if a given object implements the GetListMembersResponseDto interface.
 */
export function instanceOfGetListMembersResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "order" in value;
    isInstance = isInstance && "listId" in value;
    isInstance = isInstance && "orderType" in value;
    isInstance = isInstance && "data" in value;

    return isInstance;
}

export function GetListMembersResponseDtoFromJSON(json: any): GetListMembersResponseDto {
    return GetListMembersResponseDtoFromJSONTyped(json, false);
}

export function GetListMembersResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetListMembersResponseDto {
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

export function GetListMembersResponseDtoToJSON(value?: GetListMembersResponseDto | null): any {
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


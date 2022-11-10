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
 * @interface GetListMembersRequestDto
 */
export interface GetListMembersRequestDto {
    /**
     * 
     * @type {Date}
     * @memberof GetListMembersRequestDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof GetListMembersRequestDto
     */
    lastId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetListMembersRequestDto
     */
    search?: string;
    /**
     * 
     * @type {string}
     * @memberof GetListMembersRequestDto
     */
    order: GetListMembersRequestDtoOrderEnum;
    /**
     * 
     * @type {string}
     * @memberof GetListMembersRequestDto
     */
    listId: string;
    /**
     * 
     * @type {string}
     * @memberof GetListMembersRequestDto
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof GetListMembersRequestDto
     */
    displayName?: string | null;
    /**
     * 
     * @type {number}
     * @memberof GetListMembersRequestDto
     */
    metadataNumber?: number | null;
    /**
     * 
     * @type {string}
     * @memberof GetListMembersRequestDto
     */
    orderType: GetListMembersRequestDtoOrderTypeEnum;
}


/**
 * @export
 */
export const GetListMembersRequestDtoOrderEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type GetListMembersRequestDtoOrderEnum = typeof GetListMembersRequestDtoOrderEnum[keyof typeof GetListMembersRequestDtoOrderEnum];

/**
 * @export
 */
export const GetListMembersRequestDtoOrderTypeEnum = {
    Username: 'username',
    DisplayName: 'display name',
    CreatedAt: 'created at',
    Metadata: 'metadata'
} as const;
export type GetListMembersRequestDtoOrderTypeEnum = typeof GetListMembersRequestDtoOrderTypeEnum[keyof typeof GetListMembersRequestDtoOrderTypeEnum];


/**
 * Check if a given object implements the GetListMembersRequestDto interface.
 */
export function instanceOfGetListMembersRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "order" in value;
    isInstance = isInstance && "listId" in value;
    isInstance = isInstance && "orderType" in value;

    return isInstance;
}

export function GetListMembersRequestDtoFromJSON(json: any): GetListMembersRequestDto {
    return GetListMembersRequestDtoFromJSONTyped(json, false);
}

export function GetListMembersRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetListMembersRequestDto {
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
    };
}

export function GetListMembersRequestDtoToJSON(value?: GetListMembersRequestDto | null): any {
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
    };
}


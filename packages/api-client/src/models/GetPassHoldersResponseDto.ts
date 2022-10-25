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
import type { PassHolderDto } from './PassHolderDto';
import {
    PassHolderDtoFromJSON,
    PassHolderDtoFromJSONTyped,
    PassHolderDtoToJSON,
} from './PassHolderDto';

/**
 * 
 * @export
 * @interface GetPassHoldersResponseDto
 */
export interface GetPassHoldersResponseDto {
    /**
     * 
     * @type {Date}
     * @memberof GetPassHoldersResponseDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersResponseDto
     */
    lastId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersResponseDto
     */
    search?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersResponseDto
     */
    order: GetPassHoldersResponseDtoOrderEnum;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersResponseDto
     */
    holderId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersResponseDto
     */
    passId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersResponseDto
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersResponseDto
     */
    displayName?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersResponseDto
     */
    orderType: GetPassHoldersResponseDtoOrderTypeEnum;
    /**
     * 
     * @type {boolean}
     * @memberof GetPassHoldersResponseDto
     */
    activeOnly: boolean;
    /**
     * 
     * @type {Array<PassHolderDto>}
     * @memberof GetPassHoldersResponseDto
     */
    data: Array<PassHolderDto>;
}


/**
 * @export
 */
export const GetPassHoldersResponseDtoOrderEnum = {
    Asc: 'asc',
    Desc: 'desc'
} as const;
export type GetPassHoldersResponseDtoOrderEnum = typeof GetPassHoldersResponseDtoOrderEnum[keyof typeof GetPassHoldersResponseDtoOrderEnum];

/**
 * @export
 */
export const GetPassHoldersResponseDtoOrderTypeEnum = {
    Username: 'username',
    DisplayName: 'display name',
    CreatedAt: 'created at',
    Metadata: 'metadata'
} as const;
export type GetPassHoldersResponseDtoOrderTypeEnum = typeof GetPassHoldersResponseDtoOrderTypeEnum[keyof typeof GetPassHoldersResponseDtoOrderTypeEnum];


/**
 * Check if a given object implements the GetPassHoldersResponseDto interface.
 */
export function instanceOfGetPassHoldersResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "order" in value;
    isInstance = isInstance && "orderType" in value;
    isInstance = isInstance && "activeOnly" in value;
    isInstance = isInstance && "data" in value;

    return isInstance;
}

export function GetPassHoldersResponseDtoFromJSON(json: any): GetPassHoldersResponseDto {
    return GetPassHoldersResponseDtoFromJSONTyped(json, false);
}

export function GetPassHoldersResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetPassHoldersResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'lastId': !exists(json, 'lastId') ? undefined : json['lastId'],
        'search': !exists(json, 'search') ? undefined : json['search'],
        'order': json['order'],
        'holderId': !exists(json, 'holderId') ? undefined : json['holderId'],
        'passId': !exists(json, 'passId') ? undefined : json['passId'],
        'username': !exists(json, 'username') ? undefined : json['username'],
        'displayName': !exists(json, 'displayName') ? undefined : json['displayName'],
        'orderType': json['orderType'],
        'activeOnly': json['activeOnly'],
        'data': ((json['data'] as Array<any>).map(PassHolderDtoFromJSON)),
    };
}

export function GetPassHoldersResponseDtoToJSON(value?: GetPassHoldersResponseDto | null): any {
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
        'holderId': value.holderId,
        'passId': value.passId,
        'username': value.username,
        'displayName': value.displayName,
        'orderType': value.orderType,
        'activeOnly': value.activeOnly,
        'data': ((value.data as Array<any>).map(PassHolderDtoToJSON)),
    };
}


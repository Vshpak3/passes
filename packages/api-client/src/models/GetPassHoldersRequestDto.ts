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
 * @interface GetPassHoldersRequestDto
 */
export interface GetPassHoldersRequestDto {
    /**
     * 
     * @type {Date}
     * @memberof GetPassHoldersRequestDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersRequestDto
     */
    lastId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersRequestDto
     */
    search?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersRequestDto
     */
    order: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersRequestDto
     */
    holderId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersRequestDto
     */
    passId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersRequestDto
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersRequestDto
     */
    displayName?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersRequestDto
     */
    orderType: GetPassHoldersRequestDtoOrderTypeEnum;
    /**
     * 
     * @type {boolean}
     * @memberof GetPassHoldersRequestDto
     */
    activeOnly: boolean;
}


/**
 * @export
 */
export const GetPassHoldersRequestDtoOrderTypeEnum = {
    Username: 'username',
    DisplayName: 'display name',
    CreatedAt: 'created at'
} as const;
export type GetPassHoldersRequestDtoOrderTypeEnum = typeof GetPassHoldersRequestDtoOrderTypeEnum[keyof typeof GetPassHoldersRequestDtoOrderTypeEnum];


/**
 * Check if a given object implements the GetPassHoldersRequestDto interface.
 */
export function instanceOfGetPassHoldersRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "order" in value;
    isInstance = isInstance && "orderType" in value;
    isInstance = isInstance && "activeOnly" in value;

    return isInstance;
}

export function GetPassHoldersRequestDtoFromJSON(json: any): GetPassHoldersRequestDto {
    return GetPassHoldersRequestDtoFromJSONTyped(json, false);
}

export function GetPassHoldersRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetPassHoldersRequestDto {
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
    };
}

export function GetPassHoldersRequestDtoToJSON(value?: GetPassHoldersRequestDto | null): any {
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
    };
}


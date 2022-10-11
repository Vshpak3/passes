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
 * @interface ListMemberDto
 */
export interface ListMemberDto {
    /**
     * 
     * @type {string}
     * @memberof ListMemberDto
     */
    listMemberId: string;
    /**
     * 
     * @type {string}
     * @memberof ListMemberDto
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof ListMemberDto
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof ListMemberDto
     */
    displayName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ListMemberDto
     */
    follow?: string;
    /**
     * 
     * @type {Date}
     * @memberof ListMemberDto
     */
    createdAt: Date;
}

/**
 * Check if a given object implements the ListMemberDto interface.
 */
export function instanceOfListMemberDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "listMemberId" in value;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "username" in value;
    isInstance = isInstance && "createdAt" in value;

    return isInstance;
}

export function ListMemberDtoFromJSON(json: any): ListMemberDto {
    return ListMemberDtoFromJSONTyped(json, false);
}

export function ListMemberDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ListMemberDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'listMemberId': json['listMemberId'],
        'userId': json['userId'],
        'username': json['username'],
        'displayName': !exists(json, 'displayName') ? undefined : json['displayName'],
        'follow': !exists(json, 'follow') ? undefined : json['follow'],
        'createdAt': (new Date(json['createdAt'])),
    };
}

export function ListMemberDtoToJSON(value?: ListMemberDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'listMemberId': value.listMemberId,
        'userId': value.userId,
        'username': value.username,
        'displayName': value.displayName,
        'follow': value.follow,
        'createdAt': (value.createdAt.toISOString()),
    };
}


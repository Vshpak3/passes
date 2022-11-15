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
 * @interface PostBuyerDto
 */
export interface PostBuyerDto {
    /**
     * 
     * @type {string}
     * @memberof PostBuyerDto
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof PostBuyerDto
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof PostBuyerDto
     */
    displayName: string;
    /**
     * 
     * @type {string}
     * @memberof PostBuyerDto
     */
    postUserAccessId: string;
    /**
     * 
     * @type {Date}
     * @memberof PostBuyerDto
     */
    paidAt: Date | null;
}

/**
 * Check if a given object implements the PostBuyerDto interface.
 */
export function instanceOfPostBuyerDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "username" in value;
    isInstance = isInstance && "displayName" in value;
    isInstance = isInstance && "postUserAccessId" in value;
    isInstance = isInstance && "paidAt" in value;

    return isInstance;
}

export function PostBuyerDtoFromJSON(json: any): PostBuyerDto {
    return PostBuyerDtoFromJSONTyped(json, false);
}

export function PostBuyerDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PostBuyerDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'userId': json['userId'],
        'username': json['username'],
        'displayName': json['displayName'],
        'postUserAccessId': json['postUserAccessId'],
        'paidAt': (json['paidAt'] === null ? null : new Date(json['paidAt'])),
    };
}

export function PostBuyerDtoToJSON(value?: PostBuyerDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'userId': value.userId,
        'username': value.username,
        'displayName': value.displayName,
        'postUserAccessId': value.postUserAccessId,
        'paidAt': (value.paidAt === null ? null : value.paidAt.toISOString()),
    };
}


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
 * @interface GetPostBuyersRequestDto
 */
export interface GetPostBuyersRequestDto {
    /**
     * 
     * @type {string}
     * @memberof GetPostBuyersRequestDto
     */
    lastId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPostBuyersRequestDto
     */
    search?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPostBuyersRequestDto
     */
    postId: string;
    /**
     * 
     * @type {Date}
     * @memberof GetPostBuyersRequestDto
     */
    paidAt?: Date;
}

/**
 * Check if a given object implements the GetPostBuyersRequestDto interface.
 */
export function instanceOfGetPostBuyersRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "postId" in value;

    return isInstance;
}

export function GetPostBuyersRequestDtoFromJSON(json: any): GetPostBuyersRequestDto {
    return GetPostBuyersRequestDtoFromJSONTyped(json, false);
}

export function GetPostBuyersRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetPostBuyersRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'lastId': !exists(json, 'lastId') ? undefined : json['lastId'],
        'search': !exists(json, 'search') ? undefined : json['search'],
        'postId': json['postId'],
        'paidAt': !exists(json, 'paidAt') ? undefined : (new Date(json['paidAt'])),
    };
}

export function GetPostBuyersRequestDtoToJSON(value?: GetPostBuyersRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'lastId': value.lastId,
        'search': value.search,
        'postId': value.postId,
        'paidAt': value.paidAt === undefined ? undefined : (value.paidAt.toISOString()),
    };
}


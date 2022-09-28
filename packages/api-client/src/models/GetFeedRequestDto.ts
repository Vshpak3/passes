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
 * @interface GetFeedRequestDto
 */
export interface GetFeedRequestDto {
    /**
     * 
     * @type {Date}
     * @memberof GetFeedRequestDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof GetFeedRequestDto
     */
    lastId?: string;
}

/**
 * Check if a given object implements the GetFeedRequestDto interface.
 */
export function instanceOfGetFeedRequestDto(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function GetFeedRequestDtoFromJSON(json: any): GetFeedRequestDto {
    return GetFeedRequestDtoFromJSONTyped(json, false);
}

export function GetFeedRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetFeedRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'createdAt': !exists(json, 'createdAt') ? undefined : json['createdAt'],
        'lastId': !exists(json, 'lastId') ? undefined : json['lastId'],
    };
}

export function GetFeedRequestDtoToJSON(value?: GetFeedRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'createdAt': value.createdAt,
        'lastId': value.lastId,
    };
}


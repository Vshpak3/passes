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
 * @interface GetPaidMessagesRequestDto
 */
export interface GetPaidMessagesRequestDto {
    /**
     * 
     * @type {Date}
     * @memberof GetPaidMessagesRequestDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof GetPaidMessagesRequestDto
     */
    lastId?: string;
}

/**
 * Check if a given object implements the GetPaidMessagesRequestDto interface.
 */
export function instanceOfGetPaidMessagesRequestDto(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function GetPaidMessagesRequestDtoFromJSON(json: any): GetPaidMessagesRequestDto {
    return GetPaidMessagesRequestDtoFromJSONTyped(json, false);
}

export function GetPaidMessagesRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetPaidMessagesRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'lastId': !exists(json, 'lastId') ? undefined : json['lastId'],
    };
}

export function GetPaidMessagesRequestDtoToJSON(value?: GetPaidMessagesRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'createdAt': value.createdAt === undefined ? undefined : (value.createdAt.toISOString()),
        'lastId': value.lastId,
    };
}


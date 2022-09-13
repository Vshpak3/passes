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
     * @type {string}
     * @memberof GetPassHoldersRequestDto
     */
    userId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassHoldersRequestDto
     */
    passId?: string;
}

/**
 * Check if a given object implements the GetPassHoldersRequestDto interface.
 */
export function instanceOfGetPassHoldersRequestDto(value: object): boolean {
    let isInstance = true;

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
        
        'userId': !exists(json, 'userId') ? undefined : json['userId'],
        'passId': !exists(json, 'passId') ? undefined : json['passId'],
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
        
        'userId': value.userId,
        'passId': value.passId,
    };
}


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
 * @interface GetPostHistoryResponseDto
 */
export interface GetPostHistoryResponseDto {
    /**
     * 
     * @type {Array<string>}
     * @memberof GetPostHistoryResponseDto
     */
    postHistories: Array<string>;
}

/**
 * Check if a given object implements the GetPostHistoryResponseDto interface.
 */
export function instanceOfGetPostHistoryResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "postHistories" in value;

    return isInstance;
}

export function GetPostHistoryResponseDtoFromJSON(json: any): GetPostHistoryResponseDto {
    return GetPostHistoryResponseDtoFromJSONTyped(json, false);
}

export function GetPostHistoryResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetPostHistoryResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'postHistories': json['postHistories'],
    };
}

export function GetPostHistoryResponseDtoToJSON(value?: GetPostHistoryResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'postHistories': value.postHistories,
    };
}


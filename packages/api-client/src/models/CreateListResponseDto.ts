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
 * @interface CreateListResponseDto
 */
export interface CreateListResponseDto {
    /**
     * 
     * @type {string}
     * @memberof CreateListResponseDto
     */
    listId: string;
}

/**
 * Check if a given object implements the CreateListResponseDto interface.
 */
export function instanceOfCreateListResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "listId" in value;

    return isInstance;
}

export function CreateListResponseDtoFromJSON(json: any): CreateListResponseDto {
    return CreateListResponseDtoFromJSONTyped(json, false);
}

export function CreateListResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateListResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'listId': json['listId'],
    };
}

export function CreateListResponseDtoToJSON(value?: CreateListResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'listId': value.listId,
    };
}


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
 * @interface CreatePassResponseDto
 */
export interface CreatePassResponseDto {
    /**
     * 
     * @type {string}
     * @memberof CreatePassResponseDto
     */
    passId: string;
}

/**
 * Check if a given object implements the CreatePassResponseDto interface.
 */
export function instanceOfCreatePassResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "passId" in value;

    return isInstance;
}

export function CreatePassResponseDtoFromJSON(json: any): CreatePassResponseDto {
    return CreatePassResponseDtoFromJSONTyped(json, false);
}

export function CreatePassResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreatePassResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'passId': json['passId'],
    };
}

export function CreatePassResponseDtoToJSON(value?: CreatePassResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'passId': value.passId,
    };
}


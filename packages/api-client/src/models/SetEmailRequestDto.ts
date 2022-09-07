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
 * @interface SetEmailRequestDto
 */
export interface SetEmailRequestDto {
    /**
     * 
     * @type {string}
     * @memberof SetEmailRequestDto
     */
    email: string;
}

export function SetEmailRequestDtoFromJSON(json: any): SetEmailRequestDto {
    return SetEmailRequestDtoFromJSONTyped(json, false);
}

export function SetEmailRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SetEmailRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'email': json['email'],
    };
}

export function SetEmailRequestDtoToJSON(value?: SetEmailRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'email': value.email,
    };
}


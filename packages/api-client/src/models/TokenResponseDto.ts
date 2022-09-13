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
 * @interface TokenResponseDto
 */
export interface TokenResponseDto {
    /**
     * 
     * @type {string}
     * @memberof TokenResponseDto
     */
    token: string;
}

/**
 * Check if a given object implements the TokenResponseDto interface.
 */
export function instanceOfTokenResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "token" in value;

    return isInstance;
}

export function TokenResponseDtoFromJSON(json: any): TokenResponseDto {
    return TokenResponseDtoFromJSONTyped(json, false);
}

export function TokenResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): TokenResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'token': json['token'],
    };
}

export function TokenResponseDtoToJSON(value?: TokenResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'token': value.token,
    };
}


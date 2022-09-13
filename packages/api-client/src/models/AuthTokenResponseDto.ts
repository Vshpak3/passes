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
 * @interface AuthTokenResponseDto
 */
export interface AuthTokenResponseDto {
    /**
     * 
     * @type {string}
     * @memberof AuthTokenResponseDto
     */
    accessToken: string;
    /**
     * 
     * @type {string}
     * @memberof AuthTokenResponseDto
     */
    refreshToken: string;
}

/**
 * Check if a given object implements the AuthTokenResponseDto interface.
 */
export function instanceOfAuthTokenResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "accessToken" in value;
    isInstance = isInstance && "refreshToken" in value;

    return isInstance;
}

export function AuthTokenResponseDtoFromJSON(json: any): AuthTokenResponseDto {
    return AuthTokenResponseDtoFromJSONTyped(json, false);
}

export function AuthTokenResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): AuthTokenResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'accessToken': json['accessToken'],
        'refreshToken': json['refreshToken'],
    };
}

export function AuthTokenResponseDtoToJSON(value?: AuthTokenResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'accessToken': value.accessToken,
        'refreshToken': value.refreshToken,
    };
}


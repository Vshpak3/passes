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
 * @interface ResetPasswordRequestDto
 */
export interface ResetPasswordRequestDto {
    /**
     * 
     * @type {string}
     * @memberof ResetPasswordRequestDto
     */
    email: string;
}

/**
 * Check if a given object implements the ResetPasswordRequestDto interface.
 */
export function instanceOfResetPasswordRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "email" in value;

    return isInstance;
}

export function ResetPasswordRequestDtoFromJSON(json: any): ResetPasswordRequestDto {
    return ResetPasswordRequestDtoFromJSONTyped(json, false);
}

export function ResetPasswordRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResetPasswordRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'email': json['email'],
    };
}

export function ResetPasswordRequestDtoToJSON(value?: ResetPasswordRequestDto | null): any {
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


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
 * @interface InitResetPasswordRequestDto
 */
export interface InitResetPasswordRequestDto {
    /**
     * 
     * @type {string}
     * @memberof InitResetPasswordRequestDto
     */
    email: string;
}

/**
 * Check if a given object implements the InitResetPasswordRequestDto interface.
 */
export function instanceOfInitResetPasswordRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "email" in value;

    return isInstance;
}

export function InitResetPasswordRequestDtoFromJSON(json: any): InitResetPasswordRequestDto {
    return InitResetPasswordRequestDtoFromJSONTyped(json, false);
}

export function InitResetPasswordRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): InitResetPasswordRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'email': json['email'],
    };
}

export function InitResetPasswordRequestDtoToJSON(value?: InitResetPasswordRequestDto | null): any {
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


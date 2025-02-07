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
 * @interface ConfirmResetPasswordRequestDto
 */
export interface ConfirmResetPasswordRequestDto {
    /**
     * 
     * @type {string}
     * @memberof ConfirmResetPasswordRequestDto
     */
    password: string;
    /**
     * 
     * @type {string}
     * @memberof ConfirmResetPasswordRequestDto
     */
    verificationToken: string;
}

/**
 * Check if a given object implements the ConfirmResetPasswordRequestDto interface.
 */
export function instanceOfConfirmResetPasswordRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "password" in value;
    isInstance = isInstance && "verificationToken" in value;

    return isInstance;
}

export function ConfirmResetPasswordRequestDtoFromJSON(json: any): ConfirmResetPasswordRequestDto {
    return ConfirmResetPasswordRequestDtoFromJSONTyped(json, false);
}

export function ConfirmResetPasswordRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConfirmResetPasswordRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'password': json['password'],
        'verificationToken': json['verificationToken'],
    };
}

export function ConfirmResetPasswordRequestDtoToJSON(value?: ConfirmResetPasswordRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'password': value.password,
        'verificationToken': value.verificationToken,
    };
}


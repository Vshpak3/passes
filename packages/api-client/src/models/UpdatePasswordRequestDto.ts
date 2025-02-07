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
 * @interface UpdatePasswordRequestDto
 */
export interface UpdatePasswordRequestDto {
    /**
     * 
     * @type {string}
     * @memberof UpdatePasswordRequestDto
     */
    oldPassword: string;
    /**
     * 
     * @type {string}
     * @memberof UpdatePasswordRequestDto
     */
    newPassword: string;
}

/**
 * Check if a given object implements the UpdatePasswordRequestDto interface.
 */
export function instanceOfUpdatePasswordRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "oldPassword" in value;
    isInstance = isInstance && "newPassword" in value;

    return isInstance;
}

export function UpdatePasswordRequestDtoFromJSON(json: any): UpdatePasswordRequestDto {
    return UpdatePasswordRequestDtoFromJSONTyped(json, false);
}

export function UpdatePasswordRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdatePasswordRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'oldPassword': json['oldPassword'],
        'newPassword': json['newPassword'],
    };
}

export function UpdatePasswordRequestDtoToJSON(value?: UpdatePasswordRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'oldPassword': value.oldPassword,
        'newPassword': value.newPassword,
    };
}


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
 * @interface LocalUserLoginDto
 */
export interface LocalUserLoginDto {
    /**
     * 
     * @type {string}
     * @memberof LocalUserLoginDto
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof LocalUserLoginDto
     */
    password: string;
}

export function LocalUserLoginDtoFromJSON(json: any): LocalUserLoginDto {
    return LocalUserLoginDtoFromJSONTyped(json, false);
}

export function LocalUserLoginDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): LocalUserLoginDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'email': json['email'],
        'password': json['password'],
    };
}

export function LocalUserLoginDtoToJSON(value?: LocalUserLoginDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'email': value.email,
        'password': value.password,
    };
}


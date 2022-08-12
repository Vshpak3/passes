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
 * @interface CreateLocalUserDto
 */
export interface CreateLocalUserDto {
    /**
     * 
     * @type {string}
     * @memberof CreateLocalUserDto
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof CreateLocalUserDto
     */
    password: string;
}

export function CreateLocalUserDtoFromJSON(json: any): CreateLocalUserDto {
    return CreateLocalUserDtoFromJSONTyped(json, false);
}

export function CreateLocalUserDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateLocalUserDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'email': json['email'],
        'password': json['password'],
    };
}

export function CreateLocalUserDtoToJSON(value?: CreateLocalUserDto | null): any {
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


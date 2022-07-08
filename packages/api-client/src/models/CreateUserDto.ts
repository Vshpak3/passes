/* tslint:disable */
/* eslint-disable */
/**
 * Moment Backend
 * Be in the moment
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
 * @interface CreateUserDto
 */
export interface CreateUserDto {
    /**
     * 
     * @type {string}
     * @memberof CreateUserDto
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof CreateUserDto
     */
    userName: string;
}

export function CreateUserDtoFromJSON(json: any): CreateUserDto {
    return CreateUserDtoFromJSONTyped(json, false);
}

export function CreateUserDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateUserDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'email': json['email'],
        'userName': json['userName'],
    };
}

export function CreateUserDtoToJSON(value?: CreateUserDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'email': value.email,
        'userName': value.userName,
    };
}


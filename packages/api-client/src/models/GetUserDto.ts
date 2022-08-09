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
 * @interface GetUserDto
 */
export interface GetUserDto {
    /**
     * 
     * @type {string}
     * @memberof GetUserDto
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof GetUserDto
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof GetUserDto
     */
    userName: string;
    /**
     * 
     * @type {string}
     * @memberof GetUserDto
     */
    displayName: string;
    /**
     * 
     * @type {boolean}
     * @memberof GetUserDto
     */
    isCreator: boolean;
    /**
     * 
     * @type {string}
     * @memberof GetUserDto
     */
    legalFullName: string;
    /**
     * 
     * @type {string}
     * @memberof GetUserDto
     */
    phoneNumber: string;
    /**
     * 
     * @type {string}
     * @memberof GetUserDto
     */
    birthday: string;
}

export function GetUserDtoFromJSON(json: any): GetUserDto {
    return GetUserDtoFromJSONTyped(json, false);
}

export function GetUserDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetUserDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'email': json['email'],
        'userName': json['userName'],
        'displayName': json['displayName'],
        'isCreator': json['isCreator'],
        'legalFullName': json['legalFullName'],
        'phoneNumber': json['phoneNumber'],
        'birthday': json['birthday'],
    };
}

export function GetUserDtoToJSON(value?: GetUserDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'email': value.email,
        'userName': value.userName,
        'displayName': value.displayName,
        'isCreator': value.isCreator,
        'legalFullName': value.legalFullName,
        'phoneNumber': value.phoneNumber,
        'birthday': value.birthday,
    };
}


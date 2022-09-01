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
 * @interface GetUserResponseDto
 */
export interface GetUserResponseDto {
    /**
     * 
     * @type {string}
     * @memberof GetUserResponseDto
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof GetUserResponseDto
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof GetUserResponseDto
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof GetUserResponseDto
     */
    displayName: string;
    /**
     * 
     * @type {boolean}
     * @memberof GetUserResponseDto
     */
    isCreator: boolean;
    /**
     * 
     * @type {string}
     * @memberof GetUserResponseDto
     */
    legalFullName: string;
    /**
     * 
     * @type {string}
     * @memberof GetUserResponseDto
     */
    phoneNumber: string;
    /**
     * 
     * @type {string}
     * @memberof GetUserResponseDto
     */
    birthday: string;
    /**
     * 
     * @type {string}
     * @memberof GetUserResponseDto
     */
    countryCode: string;
}

export function GetUserResponseDtoFromJSON(json: any): GetUserResponseDto {
    return GetUserResponseDtoFromJSONTyped(json, false);
}

export function GetUserResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetUserResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'email': json['email'],
        'username': json['username'],
        'displayName': json['displayName'],
        'isCreator': json['isCreator'],
        'legalFullName': json['legalFullName'],
        'phoneNumber': json['phoneNumber'],
        'birthday': json['birthday'],
        'countryCode': json['countryCode'],
    };
}

export function GetUserResponseDtoToJSON(value?: GetUserResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'email': value.email,
        'username': value.username,
        'displayName': value.displayName,
        'isCreator': value.isCreator,
        'legalFullName': value.legalFullName,
        'phoneNumber': value.phoneNumber,
        'birthday': value.birthday,
        'countryCode': value.countryCode,
    };
}


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
 * @interface GetCreatorFeeResponseDto
 */
export interface GetCreatorFeeResponseDto {
    /**
     * 
     * @type {string}
     * @memberof GetCreatorFeeResponseDto
     */
    userId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetCreatorFeeResponseDto
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof GetCreatorFeeResponseDto
     */
    secret: string;
    /**
     * 
     * @type {string}
     * @memberof GetCreatorFeeResponseDto
     */
    creatorId: string;
    /**
     * 
     * @type {number}
     * @memberof GetCreatorFeeResponseDto
     */
    fiatRate: number;
    /**
     * 
     * @type {number}
     * @memberof GetCreatorFeeResponseDto
     */
    fiatFlat: number;
    /**
     * 
     * @type {number}
     * @memberof GetCreatorFeeResponseDto
     */
    cryptoRate: number;
    /**
     * 
     * @type {number}
     * @memberof GetCreatorFeeResponseDto
     */
    cryptoFlat: number;
}

/**
 * Check if a given object implements the GetCreatorFeeResponseDto interface.
 */
export function instanceOfGetCreatorFeeResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "secret" in value;
    isInstance = isInstance && "creatorId" in value;
    isInstance = isInstance && "fiatRate" in value;
    isInstance = isInstance && "fiatFlat" in value;
    isInstance = isInstance && "cryptoRate" in value;
    isInstance = isInstance && "cryptoFlat" in value;

    return isInstance;
}

export function GetCreatorFeeResponseDtoFromJSON(json: any): GetCreatorFeeResponseDto {
    return GetCreatorFeeResponseDtoFromJSONTyped(json, false);
}

export function GetCreatorFeeResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetCreatorFeeResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'userId': !exists(json, 'userId') ? undefined : json['userId'],
        'username': !exists(json, 'username') ? undefined : json['username'],
        'secret': json['secret'],
        'creatorId': json['creatorId'],
        'fiatRate': json['fiatRate'],
        'fiatFlat': json['fiatFlat'],
        'cryptoRate': json['cryptoRate'],
        'cryptoFlat': json['cryptoFlat'],
    };
}

export function GetCreatorFeeResponseDtoToJSON(value?: GetCreatorFeeResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'userId': value.userId,
        'username': value.username,
        'secret': value.secret,
        'creatorId': value.creatorId,
        'fiatRate': value.fiatRate,
        'fiatFlat': value.fiatFlat,
        'cryptoRate': value.cryptoRate,
        'cryptoFlat': value.cryptoFlat,
    };
}


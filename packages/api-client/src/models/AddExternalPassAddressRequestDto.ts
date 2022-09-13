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
 * @interface AddExternalPassAddressRequestDto
 */
export interface AddExternalPassAddressRequestDto {
    /**
     * 
     * @type {string}
     * @memberof AddExternalPassAddressRequestDto
     */
    userId?: string;
    /**
     * 
     * @type {string}
     * @memberof AddExternalPassAddressRequestDto
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof AddExternalPassAddressRequestDto
     */
    secret: string;
    /**
     * 
     * @type {string}
     * @memberof AddExternalPassAddressRequestDto
     */
    address: string;
    /**
     * 
     * @type {string}
     * @memberof AddExternalPassAddressRequestDto
     */
    passId: string;
    /**
     * 
     * @type {string}
     * @memberof AddExternalPassAddressRequestDto
     */
    chain: string;
}

/**
 * Check if a given object implements the AddExternalPassAddressRequestDto interface.
 */
export function instanceOfAddExternalPassAddressRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "secret" in value;
    isInstance = isInstance && "address" in value;
    isInstance = isInstance && "passId" in value;
    isInstance = isInstance && "chain" in value;

    return isInstance;
}

export function AddExternalPassAddressRequestDtoFromJSON(json: any): AddExternalPassAddressRequestDto {
    return AddExternalPassAddressRequestDtoFromJSONTyped(json, false);
}

export function AddExternalPassAddressRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): AddExternalPassAddressRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'userId': !exists(json, 'userId') ? undefined : json['userId'],
        'username': !exists(json, 'username') ? undefined : json['username'],
        'secret': json['secret'],
        'address': json['address'],
        'passId': json['passId'],
        'chain': json['chain'],
    };
}

export function AddExternalPassAddressRequestDtoToJSON(value?: AddExternalPassAddressRequestDto | null): any {
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
        'address': value.address,
        'passId': value.passId,
        'chain': value.chain,
    };
}


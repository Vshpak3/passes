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
 * @interface WalletDto
 */
export interface WalletDto {
    /**
     * 
     * @type {string}
     * @memberof WalletDto
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof WalletDto
     */
    userId?: string;
    /**
     * 
     * @type {string}
     * @memberof WalletDto
     */
    address: string;
    /**
     * 
     * @type {string}
     * @memberof WalletDto
     */
    chain: string;
    /**
     * 
     * @type {boolean}
     * @memberof WalletDto
     */
    custodial: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof WalletDto
     */
    authenticated: boolean;
}

export function WalletDtoFromJSON(json: any): WalletDto {
    return WalletDtoFromJSONTyped(json, false);
}

export function WalletDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): WalletDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'userId': !exists(json, 'userId') ? undefined : json['userId'],
        'address': json['address'],
        'chain': json['chain'],
        'custodial': json['custodial'],
        'authenticated': json['authenticated'],
    };
}

export function WalletDtoToJSON(value?: WalletDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'userId': value.userId,
        'address': value.address,
        'chain': value.chain,
        'custodial': value.custodial,
        'authenticated': value.authenticated,
    };
}


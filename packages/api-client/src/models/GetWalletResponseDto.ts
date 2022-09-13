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
 * @interface GetWalletResponseDto
 */
export interface GetWalletResponseDto {
    /**
     * 
     * @type {string}
     * @memberof GetWalletResponseDto
     */
    walletId: string;
    /**
     * 
     * @type {string}
     * @memberof GetWalletResponseDto
     */
    userId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetWalletResponseDto
     */
    address: string;
    /**
     * 
     * @type {string}
     * @memberof GetWalletResponseDto
     */
    chain: string;
    /**
     * 
     * @type {boolean}
     * @memberof GetWalletResponseDto
     */
    custodial: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof GetWalletResponseDto
     */
    authenticated: boolean;
}

/**
 * Check if a given object implements the GetWalletResponseDto interface.
 */
export function instanceOfGetWalletResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "walletId" in value;
    isInstance = isInstance && "address" in value;
    isInstance = isInstance && "chain" in value;
    isInstance = isInstance && "custodial" in value;
    isInstance = isInstance && "authenticated" in value;

    return isInstance;
}

export function GetWalletResponseDtoFromJSON(json: any): GetWalletResponseDto {
    return GetWalletResponseDtoFromJSONTyped(json, false);
}

export function GetWalletResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetWalletResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'walletId': json['walletId'],
        'userId': !exists(json, 'userId') ? undefined : json['userId'],
        'address': json['address'],
        'chain': json['chain'],
        'custodial': json['custodial'],
        'authenticated': json['authenticated'],
    };
}

export function GetWalletResponseDtoToJSON(value?: GetWalletResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'walletId': value.walletId,
        'userId': value.userId,
        'address': value.address,
        'chain': value.chain,
        'custodial': value.custodial,
        'authenticated': value.authenticated,
    };
}


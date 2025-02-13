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
 * @interface AuthWalletResponseDto
 */
export interface AuthWalletResponseDto {
    /**
     * 
     * @type {string}
     * @memberof AuthWalletResponseDto
     */
    rawMessage: string;
    /**
     * 
     * @type {string}
     * @memberof AuthWalletResponseDto
     */
    walletAddress: string;
    /**
     * 
     * @type {string}
     * @memberof AuthWalletResponseDto
     */
    chain: AuthWalletResponseDtoChainEnum;
}


/**
 * @export
 */
export const AuthWalletResponseDtoChainEnum = {
    Eth: 'eth',
    Sol: 'sol',
    Avax: 'avax',
    Matic: 'matic'
} as const;
export type AuthWalletResponseDtoChainEnum = typeof AuthWalletResponseDtoChainEnum[keyof typeof AuthWalletResponseDtoChainEnum];


/**
 * Check if a given object implements the AuthWalletResponseDto interface.
 */
export function instanceOfAuthWalletResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "rawMessage" in value;
    isInstance = isInstance && "walletAddress" in value;
    isInstance = isInstance && "chain" in value;

    return isInstance;
}

export function AuthWalletResponseDtoFromJSON(json: any): AuthWalletResponseDto {
    return AuthWalletResponseDtoFromJSONTyped(json, false);
}

export function AuthWalletResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): AuthWalletResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'rawMessage': json['rawMessage'],
        'walletAddress': json['walletAddress'],
        'chain': json['chain'],
    };
}

export function AuthWalletResponseDtoToJSON(value?: AuthWalletResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'rawMessage': value.rawMessage,
        'walletAddress': value.walletAddress,
        'chain': value.chain,
    };
}


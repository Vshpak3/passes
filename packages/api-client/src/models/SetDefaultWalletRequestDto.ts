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
 * @interface SetDefaultWalletRequestDto
 */
export interface SetDefaultWalletRequestDto {
    /**
     * 
     * @type {string}
     * @memberof SetDefaultWalletRequestDto
     */
    chain: SetDefaultWalletRequestDtoChainEnum;
    /**
     * 
     * @type {string}
     * @memberof SetDefaultWalletRequestDto
     */
    walletId: string;
}


/**
 * @export
 */
export const SetDefaultWalletRequestDtoChainEnum = {
    Eth: 'eth',
    Sol: 'sol',
    Avax: 'avax',
    Matic: 'matic'
} as const;
export type SetDefaultWalletRequestDtoChainEnum = typeof SetDefaultWalletRequestDtoChainEnum[keyof typeof SetDefaultWalletRequestDtoChainEnum];


/**
 * Check if a given object implements the SetDefaultWalletRequestDto interface.
 */
export function instanceOfSetDefaultWalletRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "chain" in value;
    isInstance = isInstance && "walletId" in value;

    return isInstance;
}

export function SetDefaultWalletRequestDtoFromJSON(json: any): SetDefaultWalletRequestDto {
    return SetDefaultWalletRequestDtoFromJSONTyped(json, false);
}

export function SetDefaultWalletRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SetDefaultWalletRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'chain': json['chain'],
        'walletId': json['walletId'],
    };
}

export function SetDefaultWalletRequestDtoToJSON(value?: SetDefaultWalletRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'chain': value.chain,
        'walletId': value.walletId,
    };
}


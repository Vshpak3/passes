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
import type { WalletDto } from './WalletDto';
import {
    WalletDtoFromJSON,
    WalletDtoFromJSONTyped,
    WalletDtoToJSON,
} from './WalletDto';

/**
 * 
 * @export
 * @interface GetWalletsResponseDto
 */
export interface GetWalletsResponseDto {
    /**
     * 
     * @type {Array<WalletDto>}
     * @memberof GetWalletsResponseDto
     */
    wallets: Array<WalletDto>;
}

/**
 * Check if a given object implements the GetWalletsResponseDto interface.
 */
export function instanceOfGetWalletsResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "wallets" in value;

    return isInstance;
}

export function GetWalletsResponseDtoFromJSON(json: any): GetWalletsResponseDto {
    return GetWalletsResponseDtoFromJSONTyped(json, false);
}

export function GetWalletsResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetWalletsResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'wallets': ((json['wallets'] as Array<any>).map(WalletDtoFromJSON)),
    };
}

export function GetWalletsResponseDtoToJSON(value?: GetWalletsResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'wallets': ((value.wallets as Array<any>).map(WalletDtoToJSON)),
    };
}


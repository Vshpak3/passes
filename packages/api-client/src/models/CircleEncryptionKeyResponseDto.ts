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
 * @interface CircleEncryptionKeyResponseDto
 */
export interface CircleEncryptionKeyResponseDto {
    /**
     * 
     * @type {string}
     * @memberof CircleEncryptionKeyResponseDto
     */
    keyId: string;
    /**
     * 
     * @type {string}
     * @memberof CircleEncryptionKeyResponseDto
     */
    publicKey: string;
}

/**
 * Check if a given object implements the CircleEncryptionKeyResponseDto interface.
 */
export function instanceOfCircleEncryptionKeyResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "keyId" in value;
    isInstance = isInstance && "publicKey" in value;

    return isInstance;
}

export function CircleEncryptionKeyResponseDtoFromJSON(json: any): CircleEncryptionKeyResponseDto {
    return CircleEncryptionKeyResponseDtoFromJSONTyped(json, false);
}

export function CircleEncryptionKeyResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CircleEncryptionKeyResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'keyId': json['keyId'],
        'publicKey': json['publicKey'],
    };
}

export function CircleEncryptionKeyResponseDtoToJSON(value?: CircleEncryptionKeyResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'keyId': value.keyId,
        'publicKey': value.publicKey,
    };
}


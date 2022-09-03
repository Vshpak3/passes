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
 * @interface VerifyEmailDto
 */
export interface VerifyEmailDto {
    /**
     * 
     * @type {string}
     * @memberof VerifyEmailDto
     */
    verificationToken: string;
}

export function VerifyEmailDtoFromJSON(json: any): VerifyEmailDto {
    return VerifyEmailDtoFromJSONTyped(json, false);
}

export function VerifyEmailDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): VerifyEmailDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'verificationToken': json['verificationToken'],
    };
}

export function VerifyEmailDtoToJSON(value?: VerifyEmailDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'verificationToken': value.verificationToken,
    };
}


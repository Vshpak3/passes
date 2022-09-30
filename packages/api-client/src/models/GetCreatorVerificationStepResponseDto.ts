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
 * @interface GetCreatorVerificationStepResponseDto
 */
export interface GetCreatorVerificationStepResponseDto {
    /**
     * 
     * @type {string}
     * @memberof GetCreatorVerificationStepResponseDto
     */
    step: GetCreatorVerificationStepResponseDtoStepEnum;
    /**
     * 
     * @type {string}
     * @memberof GetCreatorVerificationStepResponseDto
     */
    accessToken?: string;
}


/**
 * @export
 */
export const GetCreatorVerificationStepResponseDtoStepEnum = {
    _1Profile: 'step 1 profile',
    _2Kyc: 'step 2 KYC',
    _3Payout: 'step 3 payout',
    _4Done: 'step 4 done'
} as const;
export type GetCreatorVerificationStepResponseDtoStepEnum = typeof GetCreatorVerificationStepResponseDtoStepEnum[keyof typeof GetCreatorVerificationStepResponseDtoStepEnum];


/**
 * Check if a given object implements the GetCreatorVerificationStepResponseDto interface.
 */
export function instanceOfGetCreatorVerificationStepResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "step" in value;

    return isInstance;
}

export function GetCreatorVerificationStepResponseDtoFromJSON(json: any): GetCreatorVerificationStepResponseDto {
    return GetCreatorVerificationStepResponseDtoFromJSONTyped(json, false);
}

export function GetCreatorVerificationStepResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetCreatorVerificationStepResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'step': json['step'],
        'accessToken': !exists(json, 'accessToken') ? undefined : json['accessToken'],
    };
}

export function GetCreatorVerificationStepResponseDtoToJSON(value?: GetCreatorVerificationStepResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'step': value.step,
        'accessToken': value.accessToken,
    };
}


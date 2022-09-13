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
 * @interface GetCreatorEarningResponseDto
 */
export interface GetCreatorEarningResponseDto {
    /**
     * 
     * @type {string}
     * @memberof GetCreatorEarningResponseDto
     */
    userId: string;
    /**
     * 
     * @type {number}
     * @memberof GetCreatorEarningResponseDto
     */
    amount: number;
    /**
     * 
     * @type {string}
     * @memberof GetCreatorEarningResponseDto
     */
    type: string;
    /**
     * 
     * @type {Date}
     * @memberof GetCreatorEarningResponseDto
     */
    createdAt: Date;
}

/**
 * Check if a given object implements the GetCreatorEarningResponseDto interface.
 */
export function instanceOfGetCreatorEarningResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "amount" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "createdAt" in value;

    return isInstance;
}

export function GetCreatorEarningResponseDtoFromJSON(json: any): GetCreatorEarningResponseDto {
    return GetCreatorEarningResponseDtoFromJSONTyped(json, false);
}

export function GetCreatorEarningResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetCreatorEarningResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'userId': json['userId'],
        'amount': json['amount'],
        'type': json['type'],
        'createdAt': (new Date(json['createdAt'])),
    };
}

export function GetCreatorEarningResponseDtoToJSON(value?: GetCreatorEarningResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'userId': value.userId,
        'amount': value.amount,
        'type': value.type,
        'createdAt': (value.createdAt.toISOString()),
    };
}


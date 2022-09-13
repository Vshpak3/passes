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
 * @interface GetCircleCardResponseDto
 */
export interface GetCircleCardResponseDto {
    /**
     * 
     * @type {string}
     * @memberof GetCircleCardResponseDto
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof GetCircleCardResponseDto
     */
    circleId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetCircleCardResponseDto
     */
    status: GetCircleCardResponseDtoStatusEnum;
    /**
     * 
     * @type {string}
     * @memberof GetCircleCardResponseDto
     */
    firstDigit: string;
    /**
     * 
     * @type {string}
     * @memberof GetCircleCardResponseDto
     */
    fourDigits: string;
    /**
     * 
     * @type {number}
     * @memberof GetCircleCardResponseDto
     */
    expMonth: number;
    /**
     * 
     * @type {number}
     * @memberof GetCircleCardResponseDto
     */
    expYear: number;
    /**
     * 
     * @type {string}
     * @memberof GetCircleCardResponseDto
     */
    name: string;
    /**
     * 
     * @type {boolean}
     * @memberof GetCircleCardResponseDto
     */
    active: boolean;
}


/**
 * @export
 */
export const GetCircleCardResponseDtoStatusEnum = {
    Pending: 'pending',
    Complete: 'complete',
    Failed: 'failed'
} as const;
export type GetCircleCardResponseDtoStatusEnum = typeof GetCircleCardResponseDtoStatusEnum[keyof typeof GetCircleCardResponseDtoStatusEnum];


/**
 * Check if a given object implements the GetCircleCardResponseDto interface.
 */
export function instanceOfGetCircleCardResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "status" in value;
    isInstance = isInstance && "firstDigit" in value;
    isInstance = isInstance && "fourDigits" in value;
    isInstance = isInstance && "expMonth" in value;
    isInstance = isInstance && "expYear" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "active" in value;

    return isInstance;
}

export function GetCircleCardResponseDtoFromJSON(json: any): GetCircleCardResponseDto {
    return GetCircleCardResponseDtoFromJSONTyped(json, false);
}

export function GetCircleCardResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetCircleCardResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'circleId': !exists(json, 'circleId') ? undefined : json['circleId'],
        'status': json['status'],
        'firstDigit': json['firstDigit'],
        'fourDigits': json['fourDigits'],
        'expMonth': json['expMonth'],
        'expYear': json['expYear'],
        'name': json['name'],
        'active': json['active'],
    };
}

export function GetCircleCardResponseDtoToJSON(value?: GetCircleCardResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'circleId': value.circleId,
        'status': value.status,
        'firstDigit': value.firstDigit,
        'fourDigits': value.fourDigits,
        'expMonth': value.expMonth,
        'expYear': value.expYear,
        'name': value.name,
        'active': value.active,
    };
}


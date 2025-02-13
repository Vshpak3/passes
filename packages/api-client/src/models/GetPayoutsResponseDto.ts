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
import type { PayoutDto } from './PayoutDto';
import {
    PayoutDtoFromJSON,
    PayoutDtoFromJSONTyped,
    PayoutDtoToJSON,
} from './PayoutDto';

/**
 * 
 * @export
 * @interface GetPayoutsResponseDto
 */
export interface GetPayoutsResponseDto {
    /**
     * 
     * @type {Date}
     * @memberof GetPayoutsResponseDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof GetPayoutsResponseDto
     */
    lastId?: string;
    /**
     * 
     * @type {Date}
     * @memberof GetPayoutsResponseDto
     */
    startDate?: Date;
    /**
     * 
     * @type {Date}
     * @memberof GetPayoutsResponseDto
     */
    endDate?: Date;
    /**
     * 
     * @type {Array<PayoutDto>}
     * @memberof GetPayoutsResponseDto
     */
    data: Array<PayoutDto>;
}

/**
 * Check if a given object implements the GetPayoutsResponseDto interface.
 */
export function instanceOfGetPayoutsResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "data" in value;

    return isInstance;
}

export function GetPayoutsResponseDtoFromJSON(json: any): GetPayoutsResponseDto {
    return GetPayoutsResponseDtoFromJSONTyped(json, false);
}

export function GetPayoutsResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetPayoutsResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'lastId': !exists(json, 'lastId') ? undefined : json['lastId'],
        'startDate': !exists(json, 'startDate') ? undefined : (new Date(json['startDate'])),
        'endDate': !exists(json, 'endDate') ? undefined : (new Date(json['endDate'])),
        'data': ((json['data'] as Array<any>).map(PayoutDtoFromJSON)),
    };
}

export function GetPayoutsResponseDtoToJSON(value?: GetPayoutsResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'createdAt': value.createdAt === undefined ? undefined : (value.createdAt.toISOString()),
        'lastId': value.lastId,
        'startDate': value.startDate === undefined ? undefined : (value.startDate.toISOString()),
        'endDate': value.endDate === undefined ? undefined : (value.endDate.toISOString()),
        'data': ((value.data as Array<any>).map(PayoutDtoToJSON)),
    };
}


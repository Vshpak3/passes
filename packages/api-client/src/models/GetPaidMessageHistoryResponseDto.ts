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
import type { PaidMessageHistoryDto } from './PaidMessageHistoryDto';
import {
    PaidMessageHistoryDtoFromJSON,
    PaidMessageHistoryDtoFromJSONTyped,
    PaidMessageHistoryDtoToJSON,
} from './PaidMessageHistoryDto';

/**
 * 
 * @export
 * @interface GetPaidMessageHistoryResponseDto
 */
export interface GetPaidMessageHistoryResponseDto {
    /**
     * 
     * @type {Array<PaidMessageHistoryDto>}
     * @memberof GetPaidMessageHistoryResponseDto
     */
    paidMessageHistories: Array<PaidMessageHistoryDto>;
}

/**
 * Check if a given object implements the GetPaidMessageHistoryResponseDto interface.
 */
export function instanceOfGetPaidMessageHistoryResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "paidMessageHistories" in value;

    return isInstance;
}

export function GetPaidMessageHistoryResponseDtoFromJSON(json: any): GetPaidMessageHistoryResponseDto {
    return GetPaidMessageHistoryResponseDtoFromJSONTyped(json, false);
}

export function GetPaidMessageHistoryResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetPaidMessageHistoryResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'paidMessageHistories': ((json['paidMessageHistories'] as Array<any>).map(PaidMessageHistoryDtoFromJSON)),
    };
}

export function GetPaidMessageHistoryResponseDtoToJSON(value?: GetPaidMessageHistoryResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'paidMessageHistories': ((value.paidMessageHistories as Array<any>).map(PaidMessageHistoryDtoToJSON)),
    };
}


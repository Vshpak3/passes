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
import type { CreatorEarningDto } from './CreatorEarningDto';
import {
    CreatorEarningDtoFromJSON,
    CreatorEarningDtoFromJSONTyped,
    CreatorEarningDtoToJSON,
} from './CreatorEarningDto';

/**
 * 
 * @export
 * @interface GetCreatorEarningsResponseDto
 */
export interface GetCreatorEarningsResponseDto {
    /**
     * 
     * @type {Array<CreatorEarningDto>}
     * @memberof GetCreatorEarningsResponseDto
     */
    earnings: Array<CreatorEarningDto>;
}

/**
 * Check if a given object implements the GetCreatorEarningsResponseDto interface.
 */
export function instanceOfGetCreatorEarningsResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "earnings" in value;

    return isInstance;
}

export function GetCreatorEarningsResponseDtoFromJSON(json: any): GetCreatorEarningsResponseDto {
    return GetCreatorEarningsResponseDtoFromJSONTyped(json, false);
}

export function GetCreatorEarningsResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetCreatorEarningsResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'earnings': ((json['earnings'] as Array<any>).map(CreatorEarningDtoFromJSON)),
    };
}

export function GetCreatorEarningsResponseDtoToJSON(value?: GetCreatorEarningsResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'earnings': ((value.earnings as Array<any>).map(CreatorEarningDtoToJSON)),
    };
}


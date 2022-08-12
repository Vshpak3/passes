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
import {
    GetPassDto,
    GetPassDtoFromJSON,
    GetPassDtoFromJSONTyped,
    GetPassDtoToJSON,
} from './GetPassDto';

/**
 * 
 * @export
 * @interface GetPassesDto
 */
export interface GetPassesDto {
    /**
     * 
     * @type {Array<GetPassDto>}
     * @memberof GetPassesDto
     */
    passes: Array<GetPassDto>;
}

export function GetPassesDtoFromJSON(json: any): GetPassesDto {
    return GetPassesDtoFromJSONTyped(json, false);
}

export function GetPassesDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetPassesDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'passes': ((json['passes'] as Array<any>).map(GetPassDtoFromJSON)),
    };
}

export function GetPassesDtoToJSON(value?: GetPassesDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'passes': ((value.passes as Array<any>).map(GetPassDtoToJSON)),
    };
}


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
import type { FanWallCommentDto } from './FanWallCommentDto';
import {
    FanWallCommentDtoFromJSON,
    FanWallCommentDtoFromJSONTyped,
    FanWallCommentDtoToJSON,
} from './FanWallCommentDto';

/**
 * 
 * @export
 * @interface GetFanWallForCreatorResponseDto
 */
export interface GetFanWallForCreatorResponseDto {
    /**
     * 
     * @type {Array<FanWallCommentDto>}
     * @memberof GetFanWallForCreatorResponseDto
     */
    comments: Array<FanWallCommentDto>;
}

/**
 * Check if a given object implements the GetFanWallForCreatorResponseDto interface.
 */
export function instanceOfGetFanWallForCreatorResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "comments" in value;

    return isInstance;
}

export function GetFanWallForCreatorResponseDtoFromJSON(json: any): GetFanWallForCreatorResponseDto {
    return GetFanWallForCreatorResponseDtoFromJSONTyped(json, false);
}

export function GetFanWallForCreatorResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetFanWallForCreatorResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'comments': ((json['comments'] as Array<any>).map(FanWallCommentDtoFromJSON)),
    };
}

export function GetFanWallForCreatorResponseDtoToJSON(value?: GetFanWallForCreatorResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'comments': ((value.comments as Array<any>).map(FanWallCommentDtoToJSON)),
    };
}


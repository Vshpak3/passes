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
 * @interface GetFanWallResponseDto
 */
export interface GetFanWallResponseDto {
    /**
     * 
     * @type {Date}
     * @memberof GetFanWallResponseDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof GetFanWallResponseDto
     */
    lastId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetFanWallResponseDto
     */
    creatorId: string;
    /**
     * 
     * @type {Array<FanWallCommentDto>}
     * @memberof GetFanWallResponseDto
     */
    data: Array<FanWallCommentDto>;
}

/**
 * Check if a given object implements the GetFanWallResponseDto interface.
 */
export function instanceOfGetFanWallResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "creatorId" in value;
    isInstance = isInstance && "data" in value;

    return isInstance;
}

export function GetFanWallResponseDtoFromJSON(json: any): GetFanWallResponseDto {
    return GetFanWallResponseDtoFromJSONTyped(json, false);
}

export function GetFanWallResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetFanWallResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'lastId': !exists(json, 'lastId') ? undefined : json['lastId'],
        'creatorId': json['creatorId'],
        'data': ((json['data'] as Array<any>).map(FanWallCommentDtoFromJSON)),
    };
}

export function GetFanWallResponseDtoToJSON(value?: GetFanWallResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'createdAt': value.createdAt === undefined ? undefined : (value.createdAt.toISOString()),
        'lastId': value.lastId,
        'creatorId': value.creatorId,
        'data': ((value.data as Array<any>).map(FanWallCommentDtoToJSON)),
    };
}


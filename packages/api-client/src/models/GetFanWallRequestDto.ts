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
 * @interface GetFanWallRequestDto
 */
export interface GetFanWallRequestDto {
    /**
     * 
     * @type {Date}
     * @memberof GetFanWallRequestDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof GetFanWallRequestDto
     */
    lastId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetFanWallRequestDto
     */
    creatorId: string;
}

/**
 * Check if a given object implements the GetFanWallRequestDto interface.
 */
export function instanceOfGetFanWallRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "creatorId" in value;

    return isInstance;
}

export function GetFanWallRequestDtoFromJSON(json: any): GetFanWallRequestDto {
    return GetFanWallRequestDtoFromJSONTyped(json, false);
}

export function GetFanWallRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetFanWallRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'lastId': !exists(json, 'lastId') ? undefined : json['lastId'],
        'creatorId': json['creatorId'],
    };
}

export function GetFanWallRequestDtoToJSON(value?: GetFanWallRequestDto | null): any {
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
    };
}


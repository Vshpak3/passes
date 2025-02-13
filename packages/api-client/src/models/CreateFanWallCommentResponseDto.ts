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
 * @interface CreateFanWallCommentResponseDto
 */
export interface CreateFanWallCommentResponseDto {
    /**
     * 
     * @type {string}
     * @memberof CreateFanWallCommentResponseDto
     */
    fanWallCommentId: string;
}

/**
 * Check if a given object implements the CreateFanWallCommentResponseDto interface.
 */
export function instanceOfCreateFanWallCommentResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "fanWallCommentId" in value;

    return isInstance;
}

export function CreateFanWallCommentResponseDtoFromJSON(json: any): CreateFanWallCommentResponseDto {
    return CreateFanWallCommentResponseDtoFromJSONTyped(json, false);
}

export function CreateFanWallCommentResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateFanWallCommentResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'fanWallCommentId': json['fanWallCommentId'],
    };
}

export function CreateFanWallCommentResponseDtoToJSON(value?: CreateFanWallCommentResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'fanWallCommentId': value.fanWallCommentId,
    };
}


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
import type { CommentDto } from './CommentDto';
import {
    CommentDtoFromJSON,
    CommentDtoFromJSONTyped,
    CommentDtoToJSON,
} from './CommentDto';

/**
 * 
 * @export
 * @interface GetCommentsForPostResponseDto
 */
export interface GetCommentsForPostResponseDto {
    /**
     * 
     * @type {string}
     * @memberof GetCommentsForPostResponseDto
     */
    lastId: string;
    /**
     * 
     * @type {Date}
     * @memberof GetCommentsForPostResponseDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof GetCommentsForPostResponseDto
     */
    updatedAt?: Date;
    /**
     * 
     * @type {Array<CommentDto>}
     * @memberof GetCommentsForPostResponseDto
     */
    comments: Array<CommentDto>;
}

/**
 * Check if a given object implements the GetCommentsForPostResponseDto interface.
 */
export function instanceOfGetCommentsForPostResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "lastId" in value;
    isInstance = isInstance && "comments" in value;

    return isInstance;
}

export function GetCommentsForPostResponseDtoFromJSON(json: any): GetCommentsForPostResponseDto {
    return GetCommentsForPostResponseDtoFromJSONTyped(json, false);
}

export function GetCommentsForPostResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetCommentsForPostResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'lastId': json['lastId'],
        'createdAt': !exists(json, 'createdAt') ? undefined : json['createdAt'],
        'updatedAt': !exists(json, 'updatedAt') ? undefined : json['updatedAt'],
        'comments': ((json['comments'] as Array<any>).map(CommentDtoFromJSON)),
    };
}

export function GetCommentsForPostResponseDtoToJSON(value?: GetCommentsForPostResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'lastId': value.lastId,
        'createdAt': value.createdAt,
        'updatedAt': value.updatedAt,
        'comments': ((value.comments as Array<any>).map(CommentDtoToJSON)),
    };
}


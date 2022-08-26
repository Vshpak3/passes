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
    CommentDto,
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
    postId: string;
    /**
     * 
     * @type {Array<CommentDto>}
     * @memberof GetCommentsForPostResponseDto
     */
    comments: Array<CommentDto>;
}

export function GetCommentsForPostResponseDtoFromJSON(json: any): GetCommentsForPostResponseDto {
    return GetCommentsForPostResponseDtoFromJSONTyped(json, false);
}

export function GetCommentsForPostResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetCommentsForPostResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'postId': json['postId'],
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
        
        'postId': value.postId,
        'comments': ((value.comments as Array<any>).map(CommentDtoToJSON)),
    };
}


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
 * @interface GetCommentDto
 */
export interface GetCommentDto {
    /**
     * 
     * @type {string}
     * @memberof GetCommentDto
     */
    commentId: string;
    /**
     * 
     * @type {string}
     * @memberof GetCommentDto
     */
    postId: string;
    /**
     * 
     * @type {string}
     * @memberof GetCommentDto
     */
    commenterId: string;
    /**
     * 
     * @type {string}
     * @memberof GetCommentDto
     */
    content: string;
}

export function GetCommentDtoFromJSON(json: any): GetCommentDto {
    return GetCommentDtoFromJSONTyped(json, false);
}

export function GetCommentDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetCommentDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'commentId': json['commentId'],
        'postId': json['postId'],
        'commenterId': json['commenterId'],
        'content': json['content'],
    };
}

export function GetCommentDtoToJSON(value?: GetCommentDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'commentId': value.commentId,
        'postId': value.postId,
        'commenterId': value.commenterId,
        'content': value.content,
    };
}


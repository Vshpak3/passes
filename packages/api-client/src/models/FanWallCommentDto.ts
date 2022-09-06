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
 * @interface FanWallCommentDto
 */
export interface FanWallCommentDto {
    /**
     * 
     * @type {string}
     * @memberof FanWallCommentDto
     */
    fanWallCommentId: string;
    /**
     * 
     * @type {string}
     * @memberof FanWallCommentDto
     */
    creatorId: string;
    /**
     * 
     * @type {string}
     * @memberof FanWallCommentDto
     */
    commenterId: string;
    /**
     * 
     * @type {string}
     * @memberof FanWallCommentDto
     */
    text: string;
    /**
     * 
     * @type {string}
     * @memberof FanWallCommentDto
     */
    commenterUsername: string;
    /**
     * 
     * @type {string}
     * @memberof FanWallCommentDto
     */
    commenterDisplayName: string;
    /**
     * 
     * @type {Date}
     * @memberof FanWallCommentDto
     */
    createdAt: Date;
}

export function FanWallCommentDtoFromJSON(json: any): FanWallCommentDto {
    return FanWallCommentDtoFromJSONTyped(json, false);
}

export function FanWallCommentDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): FanWallCommentDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'fanWallCommentId': json['fanWallCommentId'],
        'creatorId': json['creatorId'],
        'commenterId': json['commenterId'],
        'text': json['text'],
        'commenterUsername': json['commenterUsername'],
        'commenterDisplayName': json['commenterDisplayName'],
        'createdAt': (new Date(json['createdAt'])),
    };
}

export function FanWallCommentDtoToJSON(value?: FanWallCommentDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'fanWallCommentId': value.fanWallCommentId,
        'creatorId': value.creatorId,
        'commenterId': value.commenterId,
        'text': value.text,
        'commenterUsername': value.commenterUsername,
        'commenterDisplayName': value.commenterDisplayName,
        'createdAt': (value.createdAt.toISOString()),
    };
}


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
 * @interface ContentDto
 */
export interface ContentDto {
    /**
     * 
     * @type {string}
     * @memberof ContentDto
     */
    contentId: string;
    /**
     * 
     * @type {string}
     * @memberof ContentDto
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof ContentDto
     */
    signedUrl?: string;
    /**
     * 
     * @type {string}
     * @memberof ContentDto
     */
    contentType: ContentDtoContentTypeEnum;
    /**
     * 
     * @type {number}
     * @memberof ContentDto
     */
    index: number;
    /**
     * 
     * @type {Date}
     * @memberof ContentDto
     */
    createdAt: Date;
}


/**
 * @export
 */
export const ContentDtoContentTypeEnum = {
    Image: 'image',
    Video: 'video',
    Gif: 'gif',
    Audio: 'audio'
} as const;
export type ContentDtoContentTypeEnum = typeof ContentDtoContentTypeEnum[keyof typeof ContentDtoContentTypeEnum];


/**
 * Check if a given object implements the ContentDto interface.
 */
export function instanceOfContentDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "contentId" in value;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "contentType" in value;
    isInstance = isInstance && "index" in value;
    isInstance = isInstance && "createdAt" in value;

    return isInstance;
}

export function ContentDtoFromJSON(json: any): ContentDto {
    return ContentDtoFromJSONTyped(json, false);
}

export function ContentDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ContentDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'contentId': json['contentId'],
        'userId': json['userId'],
        'signedUrl': !exists(json, 'signedUrl') ? undefined : json['signedUrl'],
        'contentType': json['contentType'],
        'index': json['index'],
        'createdAt': json['createdAt'],
    };
}

export function ContentDtoToJSON(value?: ContentDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'contentId': value.contentId,
        'userId': value.userId,
        'signedUrl': value.signedUrl,
        'contentType': value.contentType,
        'index': value.index,
        'createdAt': value.createdAt,
    };
}


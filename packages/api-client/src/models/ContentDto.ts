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
    id: string;
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
    signedUrl: string;
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
    order: number;
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
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "signedUrl" in value;
    isInstance = isInstance && "contentType" in value;
    isInstance = isInstance && "order" in value;

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
        
        'id': json['id'],
        'userId': json['userId'],
        'signedUrl': json['signedUrl'],
        'contentType': json['contentType'],
        'order': json['order'],
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
        
        'id': value.id,
        'userId': value.userId,
        'signedUrl': value.signedUrl,
        'contentType': value.contentType,
        'order': value.order,
    };
}


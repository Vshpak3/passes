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
import type { TagDto } from './TagDto';
import {
    TagDtoFromJSON,
    TagDtoFromJSONTyped,
    TagDtoToJSON,
} from './TagDto';

/**
 * 
 * @export
 * @interface CreatePostRequestDto
 */
export interface CreatePostRequestDto {
    /**
     * 
     * @type {string}
     * @memberof CreatePostRequestDto
     */
    text: string;
    /**
     * 
     * @type {Array<TagDto>}
     * @memberof CreatePostRequestDto
     */
    tags: Array<TagDto>;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreatePostRequestDto
     */
    contentIds: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreatePostRequestDto
     */
    passIds: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof CreatePostRequestDto
     */
    price?: number;
    /**
     * 
     * @type {Date}
     * @memberof CreatePostRequestDto
     */
    expiresAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof CreatePostRequestDto
     */
    scheduledAt?: Date;
}

/**
 * Check if a given object implements the CreatePostRequestDto interface.
 */
export function instanceOfCreatePostRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "text" in value;
    isInstance = isInstance && "tags" in value;
    isInstance = isInstance && "contentIds" in value;
    isInstance = isInstance && "passIds" in value;

    return isInstance;
}

export function CreatePostRequestDtoFromJSON(json: any): CreatePostRequestDto {
    return CreatePostRequestDtoFromJSONTyped(json, false);
}

export function CreatePostRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreatePostRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'text': json['text'],
        'tags': ((json['tags'] as Array<any>).map(TagDtoFromJSON)),
        'contentIds': json['contentIds'],
        'passIds': json['passIds'],
        'price': !exists(json, 'price') ? undefined : json['price'],
        'expiresAt': !exists(json, 'expiresAt') ? undefined : (new Date(json['expiresAt'])),
        'scheduledAt': !exists(json, 'scheduledAt') ? undefined : (new Date(json['scheduledAt'])),
    };
}

export function CreatePostRequestDtoToJSON(value?: CreatePostRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'text': value.text,
        'tags': ((value.tags as Array<any>).map(TagDtoToJSON)),
        'contentIds': value.contentIds,
        'passIds': value.passIds,
        'price': value.price,
        'expiresAt': value.expiresAt === undefined ? undefined : (value.expiresAt.toISOString()),
        'scheduledAt': value.scheduledAt === undefined ? undefined : (value.scheduledAt.toISOString()),
    };
}


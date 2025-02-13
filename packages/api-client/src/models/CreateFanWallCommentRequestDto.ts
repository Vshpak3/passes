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
 * @interface CreateFanWallCommentRequestDto
 */
export interface CreateFanWallCommentRequestDto {
    /**
     * 
     * @type {string}
     * @memberof CreateFanWallCommentRequestDto
     */
    creatorId: string;
    /**
     * 
     * @type {string}
     * @memberof CreateFanWallCommentRequestDto
     */
    text: string;
    /**
     * 
     * @type {Array<TagDto>}
     * @memberof CreateFanWallCommentRequestDto
     */
    tags: Array<TagDto>;
}

/**
 * Check if a given object implements the CreateFanWallCommentRequestDto interface.
 */
export function instanceOfCreateFanWallCommentRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "creatorId" in value;
    isInstance = isInstance && "text" in value;
    isInstance = isInstance && "tags" in value;

    return isInstance;
}

export function CreateFanWallCommentRequestDtoFromJSON(json: any): CreateFanWallCommentRequestDto {
    return CreateFanWallCommentRequestDtoFromJSONTyped(json, false);
}

export function CreateFanWallCommentRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateFanWallCommentRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'creatorId': json['creatorId'],
        'text': json['text'],
        'tags': ((json['tags'] as Array<any>).map(TagDtoFromJSON)),
    };
}

export function CreateFanWallCommentRequestDtoToJSON(value?: CreateFanWallCommentRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'creatorId': value.creatorId,
        'text': value.text,
        'tags': ((value.tags as Array<any>).map(TagDtoToJSON)),
    };
}


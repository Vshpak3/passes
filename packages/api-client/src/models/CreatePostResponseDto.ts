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
 * @interface CreatePostResponseDto
 */
export interface CreatePostResponseDto {
    /**
     * 
     * @type {string}
     * @memberof CreatePostResponseDto
     */
    postId: string;
}

/**
 * Check if a given object implements the CreatePostResponseDto interface.
 */
export function instanceOfCreatePostResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "postId" in value;

    return isInstance;
}

export function CreatePostResponseDtoFromJSON(json: any): CreatePostResponseDto {
    return CreatePostResponseDtoFromJSONTyped(json, false);
}

export function CreatePostResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreatePostResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'postId': json['postId'],
    };
}

export function CreatePostResponseDtoToJSON(value?: CreatePostResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'postId': value.postId,
    };
}


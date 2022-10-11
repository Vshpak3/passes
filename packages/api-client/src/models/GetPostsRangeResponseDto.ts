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
import type { PostDto } from './PostDto';
import {
    PostDtoFromJSON,
    PostDtoFromJSONTyped,
    PostDtoToJSON,
} from './PostDto';

/**
 * 
 * @export
 * @interface GetPostsRangeResponseDto
 */
export interface GetPostsRangeResponseDto {
    /**
     * 
     * @type {Array<PostDto>}
     * @memberof GetPostsRangeResponseDto
     */
    data: Array<PostDto>;
}

/**
 * Check if a given object implements the GetPostsRangeResponseDto interface.
 */
export function instanceOfGetPostsRangeResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "data" in value;

    return isInstance;
}

export function GetPostsRangeResponseDtoFromJSON(json: any): GetPostsRangeResponseDto {
    return GetPostsRangeResponseDtoFromJSONTyped(json, false);
}

export function GetPostsRangeResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetPostsRangeResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'data': ((json['data'] as Array<any>).map(PostDtoFromJSON)),
    };
}

export function GetPostsRangeResponseDtoToJSON(value?: GetPostsRangeResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'data': ((value.data as Array<any>).map(PostDtoToJSON)),
    };
}


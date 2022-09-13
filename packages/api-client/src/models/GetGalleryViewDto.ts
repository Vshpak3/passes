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
 * @interface GetGalleryViewDto
 */
export interface GetGalleryViewDto {
    /**
     * 
     * @type {Array<PostDto>}
     * @memberof GetGalleryViewDto
     */
    paid: Array<PostDto>;
    /**
     * 
     * @type {Array<PostDto>}
     * @memberof GetGalleryViewDto
     */
    unpaid: Array<PostDto>;
}

/**
 * Check if a given object implements the GetGalleryViewDto interface.
 */
export function instanceOfGetGalleryViewDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "paid" in value;
    isInstance = isInstance && "unpaid" in value;

    return isInstance;
}

export function GetGalleryViewDtoFromJSON(json: any): GetGalleryViewDto {
    return GetGalleryViewDtoFromJSONTyped(json, false);
}

export function GetGalleryViewDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetGalleryViewDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'paid': ((json['paid'] as Array<any>).map(PostDtoFromJSON)),
        'unpaid': ((json['unpaid'] as Array<any>).map(PostDtoFromJSON)),
    };
}

export function GetGalleryViewDtoToJSON(value?: GetGalleryViewDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'paid': ((value.paid as Array<any>).map(PostDtoToJSON)),
        'unpaid': ((value.unpaid as Array<any>).map(PostDtoToJSON)),
    };
}


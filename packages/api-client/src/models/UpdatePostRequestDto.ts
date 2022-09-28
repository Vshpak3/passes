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
 * @interface UpdatePostRequestDto
 */
export interface UpdatePostRequestDto {
    /**
     * 
     * @type {string}
     * @memberof UpdatePostRequestDto
     */
    text: string;
    /**
     * 
     * @type {Array<TagDto>}
     * @memberof UpdatePostRequestDto
     */
    tags: Array<TagDto>;
    /**
     * 
     * @type {Date}
     * @memberof UpdatePostRequestDto
     */
    expiresAt?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof UpdatePostRequestDto
     */
    price?: number;
}

/**
 * Check if a given object implements the UpdatePostRequestDto interface.
 */
export function instanceOfUpdatePostRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "text" in value;
    isInstance = isInstance && "tags" in value;

    return isInstance;
}

export function UpdatePostRequestDtoFromJSON(json: any): UpdatePostRequestDto {
    return UpdatePostRequestDtoFromJSONTyped(json, false);
}

export function UpdatePostRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdatePostRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'text': json['text'],
        'tags': ((json['tags'] as Array<any>).map(TagDtoFromJSON)),
        'expiresAt': !exists(json, 'expiresAt') ? undefined : json['expiresAt'],
        'price': !exists(json, 'price') ? undefined : json['price'],
    };
}

export function UpdatePostRequestDtoToJSON(value?: UpdatePostRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'text': value.text,
        'tags': ((value.tags as Array<any>).map(TagDtoToJSON)),
        'expiresAt': value.expiresAt,
        'price': value.price,
    };
}


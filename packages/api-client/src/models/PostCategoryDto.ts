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
 * @interface PostCategoryDto
 */
export interface PostCategoryDto {
    /**
     * 
     * @type {string}
     * @memberof PostCategoryDto
     */
    postCategoryId: string;
    /**
     * 
     * @type {string}
     * @memberof PostCategoryDto
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof PostCategoryDto
     */
    order: number;
    /**
     * 
     * @type {number}
     * @memberof PostCategoryDto
     */
    count: number;
}

/**
 * Check if a given object implements the PostCategoryDto interface.
 */
export function instanceOfPostCategoryDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "postCategoryId" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "order" in value;
    isInstance = isInstance && "count" in value;

    return isInstance;
}

export function PostCategoryDtoFromJSON(json: any): PostCategoryDto {
    return PostCategoryDtoFromJSONTyped(json, false);
}

export function PostCategoryDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PostCategoryDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'postCategoryId': json['postCategoryId'],
        'name': json['name'],
        'order': json['order'],
        'count': json['count'],
    };
}

export function PostCategoryDtoToJSON(value?: PostCategoryDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'postCategoryId': value.postCategoryId,
        'name': value.name,
        'order': value.order,
        'count': value.count,
    };
}


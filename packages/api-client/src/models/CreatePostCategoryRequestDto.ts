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
 * @interface CreatePostCategoryRequestDto
 */
export interface CreatePostCategoryRequestDto {
    /**
     * 
     * @type {string}
     * @memberof CreatePostCategoryRequestDto
     */
    name: string;
}

/**
 * Check if a given object implements the CreatePostCategoryRequestDto interface.
 */
export function instanceOfCreatePostCategoryRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function CreatePostCategoryRequestDtoFromJSON(json: any): CreatePostCategoryRequestDto {
    return CreatePostCategoryRequestDtoFromJSONTyped(json, false);
}

export function CreatePostCategoryRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreatePostCategoryRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
    };
}

export function CreatePostCategoryRequestDtoToJSON(value?: CreatePostCategoryRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
    };
}


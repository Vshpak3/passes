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
 * @interface SearchFollowRequestDto
 */
export interface SearchFollowRequestDto {
    /**
     * 
     * @type {string}
     * @memberof SearchFollowRequestDto
     */
    query?: string;
    /**
     * 
     * @type {string}
     * @memberof SearchFollowRequestDto
     */
    cursor?: string;
}

/**
 * Check if a given object implements the SearchFollowRequestDto interface.
 */
export function instanceOfSearchFollowRequestDto(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function SearchFollowRequestDtoFromJSON(json: any): SearchFollowRequestDto {
    return SearchFollowRequestDtoFromJSONTyped(json, false);
}

export function SearchFollowRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchFollowRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'query': !exists(json, 'query') ? undefined : json['query'],
        'cursor': !exists(json, 'cursor') ? undefined : json['cursor'],
    };
}

export function SearchFollowRequestDtoToJSON(value?: SearchFollowRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'query': value.query,
        'cursor': value.cursor,
    };
}


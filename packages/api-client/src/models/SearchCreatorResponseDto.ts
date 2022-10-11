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
import type { UserDisplayInfoDto } from './UserDisplayInfoDto';
import {
    UserDisplayInfoDtoFromJSON,
    UserDisplayInfoDtoFromJSONTyped,
    UserDisplayInfoDtoToJSON,
} from './UserDisplayInfoDto';

/**
 * 
 * @export
 * @interface SearchCreatorResponseDto
 */
export interface SearchCreatorResponseDto {
    /**
     * 
     * @type {Array<UserDisplayInfoDto>}
     * @memberof SearchCreatorResponseDto
     */
    creators: Array<UserDisplayInfoDto>;
}

/**
 * Check if a given object implements the SearchCreatorResponseDto interface.
 */
export function instanceOfSearchCreatorResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "creators" in value;

    return isInstance;
}

export function SearchCreatorResponseDtoFromJSON(json: any): SearchCreatorResponseDto {
    return SearchCreatorResponseDtoFromJSONTyped(json, false);
}

export function SearchCreatorResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchCreatorResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'creators': ((json['creators'] as Array<any>).map(UserDisplayInfoDtoFromJSON)),
    };
}

export function SearchCreatorResponseDtoToJSON(value?: SearchCreatorResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'creators': ((value.creators as Array<any>).map(UserDisplayInfoDtoToJSON)),
    };
}


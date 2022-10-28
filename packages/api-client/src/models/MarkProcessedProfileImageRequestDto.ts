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
 * @interface MarkProcessedProfileImageRequestDto
 */
export interface MarkProcessedProfileImageRequestDto {
    /**
     * 
     * @type {string}
     * @memberof MarkProcessedProfileImageRequestDto
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof MarkProcessedProfileImageRequestDto
     */
    secret: string;
}

/**
 * Check if a given object implements the MarkProcessedProfileImageRequestDto interface.
 */
export function instanceOfMarkProcessedProfileImageRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "secret" in value;

    return isInstance;
}

export function MarkProcessedProfileImageRequestDtoFromJSON(json: any): MarkProcessedProfileImageRequestDto {
    return MarkProcessedProfileImageRequestDtoFromJSONTyped(json, false);
}

export function MarkProcessedProfileImageRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): MarkProcessedProfileImageRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'userId': json['userId'],
        'secret': json['secret'],
    };
}

export function MarkProcessedProfileImageRequestDtoToJSON(value?: MarkProcessedProfileImageRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'userId': value.userId,
        'secret': value.secret,
    };
}


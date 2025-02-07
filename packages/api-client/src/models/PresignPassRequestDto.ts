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
 * @interface PresignPassRequestDto
 */
export interface PresignPassRequestDto {
    /**
     * 
     * @type {string}
     * @memberof PresignPassRequestDto
     */
    passId: string;
    /**
     * 
     * @type {string}
     * @memberof PresignPassRequestDto
     */
    type: PresignPassRequestDtoTypeEnum;
}


/**
 * @export
 */
export const PresignPassRequestDtoTypeEnum = {
    Jpeg: 'jpeg',
    Png: 'png',
    Gif: 'gif',
    Mp4: 'mp4',
    Mov: 'mov'
} as const;
export type PresignPassRequestDtoTypeEnum = typeof PresignPassRequestDtoTypeEnum[keyof typeof PresignPassRequestDtoTypeEnum];


/**
 * Check if a given object implements the PresignPassRequestDto interface.
 */
export function instanceOfPresignPassRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "passId" in value;
    isInstance = isInstance && "type" in value;

    return isInstance;
}

export function PresignPassRequestDtoFromJSON(json: any): PresignPassRequestDto {
    return PresignPassRequestDtoFromJSONTyped(json, false);
}

export function PresignPassRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PresignPassRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'passId': json['passId'],
        'type': json['type'],
    };
}

export function PresignPassRequestDtoToJSON(value?: PresignPassRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'passId': value.passId,
        'type': value.type,
    };
}


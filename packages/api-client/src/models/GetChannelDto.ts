/* tslint:disable */
/* eslint-disable */
/**
 * Moment Backend
 * Be in the moment
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
 * @interface GetChannelDto
 */
export interface GetChannelDto {
    /**
     * 
     * @type {string}
     * @memberof GetChannelDto
     */
    id: string;
}

export function GetChannelDtoFromJSON(json: any): GetChannelDto {
    return GetChannelDtoFromJSONTyped(json, false);
}

export function GetChannelDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetChannelDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
    };
}

export function GetChannelDtoToJSON(value?: GetChannelDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
    };
}


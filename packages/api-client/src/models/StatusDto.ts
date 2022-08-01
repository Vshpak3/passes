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
 * @interface StatusDto
 */
export interface StatusDto {
    /**
     * 
     * @type {string}
     * @memberof StatusDto
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof StatusDto
     */
    status: string;
}

export function StatusDtoFromJSON(json: any): StatusDto {
    return StatusDtoFromJSONTyped(json, false);
}

export function StatusDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): StatusDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'status': json['status'],
    };
}

export function StatusDtoToJSON(value?: StatusDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'status': value.status,
    };
}


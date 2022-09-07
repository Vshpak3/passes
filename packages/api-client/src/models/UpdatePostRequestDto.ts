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
     * @type {number}
     * @memberof UpdatePostRequestDto
     */
    price?: number;
    /**
     * 
     * @type {Date}
     * @memberof UpdatePostRequestDto
     */
    expiresAt?: Date;
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
        'price': !exists(json, 'price') ? undefined : json['price'],
        'expiresAt': !exists(json, 'expiresAt') ? undefined : (new Date(json['expiresAt'])),
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
        'price': value.price,
        'expiresAt': value.expiresAt === undefined ? undefined : (value.expiresAt.toISOString()),
    };
}


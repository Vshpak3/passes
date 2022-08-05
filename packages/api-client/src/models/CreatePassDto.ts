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
 * @interface CreatePassDto
 */
export interface CreatePassDto {
    /**
     * 
     * @type {string}
     * @memberof CreatePassDto
     */
    description: string;
    /**
     * 
     * @type {string}
     * @memberof CreatePassDto
     */
    imageUrl: string;
    /**
     * 
     * @type {string}
     * @memberof CreatePassDto
     */
    type: string;
    /**
     * 
     * @type {number}
     * @memberof CreatePassDto
     */
    price: number;
    /**
     * 
     * @type {number}
     * @memberof CreatePassDto
     */
    totalSupply: number;
}

export function CreatePassDtoFromJSON(json: any): CreatePassDto {
    return CreatePassDtoFromJSONTyped(json, false);
}

export function CreatePassDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreatePassDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'description': json['description'],
        'imageUrl': json['imageUrl'],
        'type': json['type'],
        'price': json['price'],
        'totalSupply': json['totalSupply'],
    };
}

export function CreatePassDtoToJSON(value?: CreatePassDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'description': value.description,
        'imageUrl': value.imageUrl,
        'type': value.type,
        'price': value.price,
        'totalSupply': value.totalSupply,
    };
}


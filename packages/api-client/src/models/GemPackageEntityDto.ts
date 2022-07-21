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
 * @interface GemPackageEntityDto
 */
export interface GemPackageEntityDto {
    /**
     * 
     * @type {string}
     * @memberof GemPackageEntityDto
     */
    id: string;
    /**
     * 
     * @type {number}
     * @memberof GemPackageEntityDto
     */
    cost: number;
    /**
     * 
     * @type {number}
     * @memberof GemPackageEntityDto
     */
    baseGems: number;
    /**
     * 
     * @type {number}
     * @memberof GemPackageEntityDto
     */
    bonusGems: number;
    /**
     * 
     * @type {boolean}
     * @memberof GemPackageEntityDto
     */
    isPublic: boolean;
    /**
     * 
     * @type {string}
     * @memberof GemPackageEntityDto
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof GemPackageEntityDto
     */
    description: string;
}

export function GemPackageEntityDtoFromJSON(json: any): GemPackageEntityDto {
    return GemPackageEntityDtoFromJSONTyped(json, false);
}

export function GemPackageEntityDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GemPackageEntityDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'cost': json['cost'],
        'baseGems': json['baseGems'],
        'bonusGems': json['bonusGems'],
        'isPublic': json['isPublic'],
        'title': json['title'],
        'description': json['description'],
    };
}

export function GemPackageEntityDtoToJSON(value?: GemPackageEntityDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'cost': value.cost,
        'baseGems': value.baseGems,
        'bonusGems': value.bonusGems,
        'isPublic': value.isPublic,
        'title': value.title,
        'description': value.description,
    };
}


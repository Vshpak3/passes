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
 * @interface PassDto
 */
export interface PassDto {
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    creatorId: string;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    solNftCollectionId: string;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    description: string;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    type: string;
    /**
     * 
     * @type {number}
     * @memberof PassDto
     */
    price: number;
    /**
     * 
     * @type {number}
     * @memberof PassDto
     */
    totalSupply: number;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    creatorUsername?: string;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    creatorDisplayName?: string;
    /**
     * 
     * @type {Date}
     * @memberof PassDto
     */
    expiresAt?: Date;
}

export function PassDtoFromJSON(json: any): PassDto {
    return PassDtoFromJSONTyped(json, false);
}

export function PassDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PassDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'creatorId': json['creatorId'],
        'solNftCollectionId': json['solNftCollectionId'],
        'title': json['title'],
        'description': json['description'],
        'type': json['type'],
        'price': json['price'],
        'totalSupply': json['totalSupply'],
        'creatorUsername': !exists(json, 'creatorUsername') ? undefined : json['creatorUsername'],
        'creatorDisplayName': !exists(json, 'creatorDisplayName') ? undefined : json['creatorDisplayName'],
        'expiresAt': !exists(json, 'expiresAt') ? undefined : (new Date(json['expiresAt'])),
    };
}

export function PassDtoToJSON(value?: PassDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'creatorId': value.creatorId,
        'solNftCollectionId': value.solNftCollectionId,
        'title': value.title,
        'description': value.description,
        'type': value.type,
        'price': value.price,
        'totalSupply': value.totalSupply,
        'creatorUsername': value.creatorUsername,
        'creatorDisplayName': value.creatorDisplayName,
        'expiresAt': value.expiresAt === undefined ? undefined : (value.expiresAt.toISOString()),
    };
}


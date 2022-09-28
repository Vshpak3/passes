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
 * @interface ListDto
 */
export interface ListDto {
    /**
     * 
     * @type {string}
     * @memberof ListDto
     */
    listId: string;
    /**
     * 
     * @type {string}
     * @memberof ListDto
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof ListDto
     */
    type: ListDtoTypeEnum;
    /**
     * 
     * @type {number}
     * @memberof ListDto
     */
    count: number;
    /**
     * 
     * @type {Date}
     * @memberof ListDto
     */
    createdAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof ListDto
     */
    updatedAt: Date;
}


/**
 * @export
 */
export const ListDtoTypeEnum = {
    Normal: 'normal',
    Followers: 'followers',
    Following: 'following'
} as const;
export type ListDtoTypeEnum = typeof ListDtoTypeEnum[keyof typeof ListDtoTypeEnum];


/**
 * Check if a given object implements the ListDto interface.
 */
export function instanceOfListDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "listId" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "count" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "updatedAt" in value;

    return isInstance;
}

export function ListDtoFromJSON(json: any): ListDto {
    return ListDtoFromJSONTyped(json, false);
}

export function ListDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ListDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'listId': json['listId'],
        'name': json['name'],
        'type': json['type'],
        'count': json['count'],
        'createdAt': json['createdAt'],
        'updatedAt': json['updatedAt'],
    };
}

export function ListDtoToJSON(value?: ListDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'listId': value.listId,
        'name': value.name,
        'type': value.type,
        'count': value.count,
        'createdAt': value.createdAt,
        'updatedAt': value.updatedAt,
    };
}


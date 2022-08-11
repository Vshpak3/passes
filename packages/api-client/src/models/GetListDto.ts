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
 * @interface GetListDto
 */
export interface GetListDto {
    /**
     * 
     * @type {string}
     * @memberof GetListDto
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof GetListDto
     */
    name: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof GetListDto
     */
    listMembers: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof GetListDto
     */
    size: number;
}

export function GetListDtoFromJSON(json: any): GetListDto {
    return GetListDtoFromJSONTyped(json, false);
}

export function GetListDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetListDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'listMembers': json['listMembers'],
        'size': json['size'],
    };
}

export function GetListDtoToJSON(value?: GetListDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'listMembers': value.listMembers,
        'size': value.size,
    };
}


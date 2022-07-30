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
 * @interface CreateSolNftDto
 */
export interface CreateSolNftDto {
    /**
     * 
     * @type {string}
     * @memberof CreateSolNftDto
     */
    collectionId: string;
    /**
     * 
     * @type {string}
     * @memberof CreateSolNftDto
     */
    owner: string;
    /**
     * 
     * @type {string}
     * @memberof CreateSolNftDto
     */
    signature: string;
    /**
     * 
     * @type {string}
     * @memberof CreateSolNftDto
     */
    uriMetadata: string;
}

export function CreateSolNftDtoFromJSON(json: any): CreateSolNftDto {
    return CreateSolNftDtoFromJSONTyped(json, false);
}

export function CreateSolNftDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateSolNftDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'collectionId': json['collectionId'],
        'owner': json['owner'],
        'signature': json['signature'],
        'uriMetadata': json['uriMetadata'],
    };
}

export function CreateSolNftDtoToJSON(value?: CreateSolNftDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'collectionId': value.collectionId,
        'owner': value.owner,
        'signature': value.signature,
        'uriMetadata': value.uriMetadata,
    };
}


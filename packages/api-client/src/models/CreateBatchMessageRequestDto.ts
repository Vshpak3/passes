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
 * @interface CreateBatchMessageRequestDto
 */
export interface CreateBatchMessageRequestDto {
    /**
     * 
     * @type {string}
     * @memberof CreateBatchMessageRequestDto
     */
    text: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreateBatchMessageRequestDto
     */
    contentIds: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof CreateBatchMessageRequestDto
     */
    previewIndex: number;
    /**
     * 
     * @type {number}
     * @memberof CreateBatchMessageRequestDto
     */
    price?: number;
    /**
     * 
     * @type {Date}
     * @memberof CreateBatchMessageRequestDto
     */
    scheduledAt?: Date;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreateBatchMessageRequestDto
     */
    includeListIds: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreateBatchMessageRequestDto
     */
    excludeListIds: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreateBatchMessageRequestDto
     */
    includePassIds: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreateBatchMessageRequestDto
     */
    excludePassIds: Array<string>;
}

/**
 * Check if a given object implements the CreateBatchMessageRequestDto interface.
 */
export function instanceOfCreateBatchMessageRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "text" in value;
    isInstance = isInstance && "contentIds" in value;
    isInstance = isInstance && "previewIndex" in value;
    isInstance = isInstance && "includeListIds" in value;
    isInstance = isInstance && "excludeListIds" in value;
    isInstance = isInstance && "includePassIds" in value;
    isInstance = isInstance && "excludePassIds" in value;

    return isInstance;
}

export function CreateBatchMessageRequestDtoFromJSON(json: any): CreateBatchMessageRequestDto {
    return CreateBatchMessageRequestDtoFromJSONTyped(json, false);
}

export function CreateBatchMessageRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateBatchMessageRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'text': json['text'],
        'contentIds': json['contentIds'],
        'previewIndex': json['previewIndex'],
        'price': !exists(json, 'price') ? undefined : json['price'],
        'scheduledAt': !exists(json, 'scheduledAt') ? undefined : (new Date(json['scheduledAt'])),
        'includeListIds': json['includeListIds'],
        'excludeListIds': json['excludeListIds'],
        'includePassIds': json['includePassIds'],
        'excludePassIds': json['excludePassIds'],
    };
}

export function CreateBatchMessageRequestDtoToJSON(value?: CreateBatchMessageRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'text': value.text,
        'contentIds': value.contentIds,
        'previewIndex': value.previewIndex,
        'price': value.price,
        'scheduledAt': value.scheduledAt === undefined ? undefined : (value.scheduledAt.toISOString()),
        'includeListIds': value.includeListIds,
        'excludeListIds': value.excludeListIds,
        'includePassIds': value.includePassIds,
        'excludePassIds': value.excludePassIds,
    };
}


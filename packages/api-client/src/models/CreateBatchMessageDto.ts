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
 * @interface CreateBatchMessageDto
 */
export interface CreateBatchMessageDto {
    /**
     * 
     * @type {string}
     * @memberof CreateBatchMessageDto
     */
    text: string;
    /**
     * 
     * @type {string}
     * @memberof CreateBatchMessageDto
     */
    list: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreateBatchMessageDto
     */
    content: Array<string>;
}

export function CreateBatchMessageDtoFromJSON(json: any): CreateBatchMessageDto {
    return CreateBatchMessageDtoFromJSONTyped(json, false);
}

export function CreateBatchMessageDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateBatchMessageDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'text': json['text'],
        'list': json['list'],
        'content': json['content'],
    };
}

export function CreateBatchMessageDtoToJSON(value?: CreateBatchMessageDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'text': value.text,
        'list': value.list,
        'content': value.content,
    };
}


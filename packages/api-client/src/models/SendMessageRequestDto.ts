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
import {
    PayinMethodDto,
    PayinMethodDtoFromJSON,
    PayinMethodDtoFromJSONTyped,
    PayinMethodDtoToJSON,
} from './PayinMethodDto';

/**
 * 
 * @export
 * @interface SendMessageRequestDto
 */
export interface SendMessageRequestDto {
    /**
     * 
     * @type {string}
     * @memberof SendMessageRequestDto
     */
    text: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof SendMessageRequestDto
     */
    attachments: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof SendMessageRequestDto
     */
    channelId: string;
    /**
     * 
     * @type {number}
     * @memberof SendMessageRequestDto
     */
    tipAmount: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof SendMessageRequestDto
     */
    content: Array<string>;
    /**
     * 
     * @type {PayinMethodDto}
     * @memberof SendMessageRequestDto
     */
    payinMethod?: PayinMethodDto;
}

export function SendMessageRequestDtoFromJSON(json: any): SendMessageRequestDto {
    return SendMessageRequestDtoFromJSONTyped(json, false);
}

export function SendMessageRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): SendMessageRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'text': json['text'],
        'attachments': json['attachments'],
        'channelId': json['channelId'],
        'tipAmount': json['tipAmount'],
        'content': json['content'],
        'payinMethod': !exists(json, 'payinMethod') ? undefined : PayinMethodDtoFromJSON(json['payinMethod']),
    };
}

export function SendMessageRequestDtoToJSON(value?: SendMessageRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'text': value.text,
        'attachments': value.attachments,
        'channelId': value.channelId,
        'tipAmount': value.tipAmount,
        'content': value.content,
        'payinMethod': PayinMethodDtoToJSON(value.payinMethod),
    };
}


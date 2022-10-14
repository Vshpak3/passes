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
import type { PayinMethodDto } from './PayinMethodDto';
import {
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
    contentIds: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof SendMessageRequestDto
     */
    previewIndex: number;
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
     * @type {number}
     * @memberof SendMessageRequestDto
     */
    price?: number;
    /**
     * 
     * @type {PayinMethodDto}
     * @memberof SendMessageRequestDto
     */
    payinMethod?: PayinMethodDto;
    /**
     * 
     * @type {Date}
     * @memberof SendMessageRequestDto
     */
    scheduledAt?: Date;
}

/**
 * Check if a given object implements the SendMessageRequestDto interface.
 */
export function instanceOfSendMessageRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "text" in value;
    isInstance = isInstance && "contentIds" in value;
    isInstance = isInstance && "previewIndex" in value;
    isInstance = isInstance && "channelId" in value;
    isInstance = isInstance && "tipAmount" in value;

    return isInstance;
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
        'contentIds': json['contentIds'],
        'previewIndex': json['previewIndex'],
        'channelId': json['channelId'],
        'tipAmount': json['tipAmount'],
        'price': !exists(json, 'price') ? undefined : json['price'],
        'payinMethod': !exists(json, 'payinMethod') ? undefined : PayinMethodDtoFromJSON(json['payinMethod']),
        'scheduledAt': !exists(json, 'scheduled_at') ? undefined : (new Date(json['scheduled_at'])),
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
        'contentIds': value.contentIds,
        'previewIndex': value.previewIndex,
        'channelId': value.channelId,
        'tipAmount': value.tipAmount,
        'price': value.price,
        'payinMethod': PayinMethodDtoToJSON(value.payinMethod),
        'scheduled_at': value.scheduledAt === undefined ? undefined : (value.scheduledAt.toISOString()),
    };
}


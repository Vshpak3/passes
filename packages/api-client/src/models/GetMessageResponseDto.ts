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
import type { ContentDto } from './ContentDto';
import {
    ContentDtoFromJSON,
    ContentDtoFromJSONTyped,
    ContentDtoToJSON,
} from './ContentDto';

/**
 * 
 * @export
 * @interface GetMessageResponseDto
 */
export interface GetMessageResponseDto {
    /**
     * 
     * @type {string}
     * @memberof GetMessageResponseDto
     */
    messageId: string;
    /**
     * 
     * @type {string}
     * @memberof GetMessageResponseDto
     */
    senderId: string;
    /**
     * 
     * @type {string}
     * @memberof GetMessageResponseDto
     */
    text: string;
    /**
     * 
     * @type {Array<ContentDto>}
     * @memberof GetMessageResponseDto
     */
    contents: Array<ContentDto>;
    /**
     * 
     * @type {string}
     * @memberof GetMessageResponseDto
     */
    channelId: string;
    /**
     * 
     * @type {number}
     * @memberof GetMessageResponseDto
     */
    tipAmount?: number;
    /**
     * 
     * @type {boolean}
     * @memberof GetMessageResponseDto
     */
    paid: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof GetMessageResponseDto
     */
    pending: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof GetMessageResponseDto
     */
    reverted: boolean;
    /**
     * 
     * @type {Date}
     * @memberof GetMessageResponseDto
     */
    sentAt: Date;
}

/**
 * Check if a given object implements the GetMessageResponseDto interface.
 */
export function instanceOfGetMessageResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "messageId" in value;
    isInstance = isInstance && "senderId" in value;
    isInstance = isInstance && "text" in value;
    isInstance = isInstance && "contents" in value;
    isInstance = isInstance && "channelId" in value;
    isInstance = isInstance && "paid" in value;
    isInstance = isInstance && "pending" in value;
    isInstance = isInstance && "reverted" in value;
    isInstance = isInstance && "sentAt" in value;

    return isInstance;
}

export function GetMessageResponseDtoFromJSON(json: any): GetMessageResponseDto {
    return GetMessageResponseDtoFromJSONTyped(json, false);
}

export function GetMessageResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetMessageResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'messageId': json['messageId'],
        'senderId': json['senderId'],
        'text': json['text'],
        'contents': ((json['contents'] as Array<any>).map(ContentDtoFromJSON)),
        'channelId': json['channelId'],
        'tipAmount': !exists(json, 'tipAmount') ? undefined : json['tipAmount'],
        'paid': json['paid'],
        'pending': json['pending'],
        'reverted': json['reverted'],
        'sentAt': (new Date(json['sentAt'])),
    };
}

export function GetMessageResponseDtoToJSON(value?: GetMessageResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'messageId': value.messageId,
        'senderId': value.senderId,
        'text': value.text,
        'contents': ((value.contents as Array<any>).map(ContentDtoToJSON)),
        'channelId': value.channelId,
        'tipAmount': value.tipAmount,
        'paid': value.paid,
        'pending': value.pending,
        'reverted': value.reverted,
        'sentAt': (value.sentAt.toISOString()),
    };
}


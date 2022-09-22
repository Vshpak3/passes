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
 * @interface MessageDto
 */
export interface MessageDto {
    /**
     * 
     * @type {string}
     * @memberof MessageDto
     */
    messageId?: string;
    /**
     * 
     * @type {string}
     * @memberof MessageDto
     */
    text: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof MessageDto
     */
    attachments: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof MessageDto
     */
    channelId: string;
    /**
     * 
     * @type {string}
     * @memberof MessageDto
     */
    otherUserId: string;
    /**
     * 
     * @type {number}
     * @memberof MessageDto
     */
    tipAmount?: number;
    /**
     * 
     * @type {boolean}
     * @memberof MessageDto
     */
    reverted?: boolean;
    /**
     * 
     * @type {number}
     * @memberof MessageDto
     */
    createdAt?: number;
}

/**
 * Check if a given object implements the MessageDto interface.
 */
export function instanceOfMessageDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "text" in value;
    isInstance = isInstance && "attachments" in value;
    isInstance = isInstance && "channelId" in value;
    isInstance = isInstance && "otherUserId" in value;

    return isInstance;
}

export function MessageDtoFromJSON(json: any): MessageDto {
    return MessageDtoFromJSONTyped(json, false);
}

export function MessageDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): MessageDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'messageId': !exists(json, 'messageId') ? undefined : json['messageId'],
        'text': json['text'],
        'attachments': json['attachments'],
        'channelId': json['channelId'],
        'otherUserId': json['otherUserId'],
        'tipAmount': !exists(json, 'tipAmount') ? undefined : json['tipAmount'],
        'reverted': !exists(json, 'reverted') ? undefined : json['reverted'],
        'createdAt': !exists(json, 'created_at') ? undefined : json['created_at'],
    };
}

export function MessageDtoToJSON(value?: MessageDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'messageId': value.messageId,
        'text': value.text,
        'attachments': value.attachments,
        'channelId': value.channelId,
        'otherUserId': value.otherUserId,
        'tipAmount': value.tipAmount,
        'reverted': value.reverted,
        'created_at': value.createdAt,
    };
}


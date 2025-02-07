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
 * @interface MessageBuyerDto
 */
export interface MessageBuyerDto {
    /**
     * 
     * @type {string}
     * @memberof MessageBuyerDto
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof MessageBuyerDto
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof MessageBuyerDto
     */
    displayName: string;
    /**
     * 
     * @type {string}
     * @memberof MessageBuyerDto
     */
    messageId: string;
    /**
     * 
     * @type {Date}
     * @memberof MessageBuyerDto
     */
    paidAt: Date | null;
}

/**
 * Check if a given object implements the MessageBuyerDto interface.
 */
export function instanceOfMessageBuyerDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "username" in value;
    isInstance = isInstance && "displayName" in value;
    isInstance = isInstance && "messageId" in value;
    isInstance = isInstance && "paidAt" in value;

    return isInstance;
}

export function MessageBuyerDtoFromJSON(json: any): MessageBuyerDto {
    return MessageBuyerDtoFromJSONTyped(json, false);
}

export function MessageBuyerDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): MessageBuyerDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'userId': json['userId'],
        'username': json['username'],
        'displayName': json['displayName'],
        'messageId': json['messageId'],
        'paidAt': (json['paidAt'] === null ? null : new Date(json['paidAt'])),
    };
}

export function MessageBuyerDtoToJSON(value?: MessageBuyerDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'userId': value.userId,
        'username': value.username,
        'displayName': value.displayName,
        'messageId': value.messageId,
        'paidAt': (value.paidAt === null ? null : value.paidAt.toISOString()),
    };
}


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
 * @interface NotificationDto
 */
export interface NotificationDto {
    /**
     * 
     * @type {string}
     * @memberof NotificationDto
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof NotificationDto
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof NotificationDto
     */
    senderDisplayName: string;
    /**
     * 
     * @type {string}
     * @memberof NotificationDto
     */
    senderUsername: string;
    /**
     * 
     * @type {string}
     * @memberof NotificationDto
     */
    status: NotificationDtoStatusEnum;
    /**
     * 
     * @type {string}
     * @memberof NotificationDto
     */
    type: NotificationDtoTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof NotificationDto
     */
    message: string;
    /**
     * 
     * @type {Date}
     * @memberof NotificationDto
     */
    createdAt: Date;
}


/**
 * @export
 */
export const NotificationDtoStatusEnum = {
    Unread: 'unread',
    Read: 'read'
} as const;
export type NotificationDtoStatusEnum = typeof NotificationDtoStatusEnum[keyof typeof NotificationDtoStatusEnum];

/**
 * @export
 */
export const NotificationDtoTypeEnum = {
    Comment: 'comment',
    Mention: 'mention',
    Subscription: 'subscription',
    Payment: 'payment',
    Other: 'other'
} as const;
export type NotificationDtoTypeEnum = typeof NotificationDtoTypeEnum[keyof typeof NotificationDtoTypeEnum];


/**
 * Check if a given object implements the NotificationDto interface.
 */
export function instanceOfNotificationDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "senderDisplayName" in value;
    isInstance = isInstance && "senderUsername" in value;
    isInstance = isInstance && "status" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "message" in value;
    isInstance = isInstance && "createdAt" in value;

    return isInstance;
}

export function NotificationDtoFromJSON(json: any): NotificationDto {
    return NotificationDtoFromJSONTyped(json, false);
}

export function NotificationDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): NotificationDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'userId': json['userId'],
        'senderDisplayName': json['senderDisplayName'],
        'senderUsername': json['senderUsername'],
        'status': json['status'],
        'type': json['type'],
        'message': json['message'],
        'createdAt': (new Date(json['createdAt'])),
    };
}

export function NotificationDtoToJSON(value?: NotificationDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'userId': value.userId,
        'senderDisplayName': value.senderDisplayName,
        'senderUsername': value.senderUsername,
        'status': value.status,
        'type': value.type,
        'message': value.message,
        'createdAt': (value.createdAt.toISOString()),
    };
}


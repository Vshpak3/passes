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
 * @interface ChannelMemberDto
 */
export interface ChannelMemberDto {
    /**
     * 
     * @type {string}
     * @memberof ChannelMemberDto
     */
    channelId?: string;
    /**
     * 
     * @type {string}
     * @memberof ChannelMemberDto
     */
    streamChannelId: string;
    /**
     * 
     * @type {Date}
     * @memberof ChannelMemberDto
     */
    recent: Date;
    /**
     * 
     * @type {string}
     * @memberof ChannelMemberDto
     */
    channelMemberId: string;
    /**
     * 
     * @type {string}
     * @memberof ChannelMemberDto
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof ChannelMemberDto
     */
    otherUserId: string;
    /**
     * 
     * @type {boolean}
     * @memberof ChannelMemberDto
     */
    unlimitedMessages: boolean;
    /**
     * 
     * @type {number}
     * @memberof ChannelMemberDto
     */
    tipSent: number;
    /**
     * 
     * @type {number}
     * @memberof ChannelMemberDto
     */
    tipRecieved: number;
    /**
     * 
     * @type {number}
     * @memberof ChannelMemberDto
     */
    unreadTip: number;
    /**
     * 
     * @type {string}
     * @memberof ChannelMemberDto
     */
    otherUserUsername?: string;
    /**
     * 
     * @type {string}
     * @memberof ChannelMemberDto
     */
    otherUserDisplayName?: string;
}

/**
 * Check if a given object implements the ChannelMemberDto interface.
 */
export function instanceOfChannelMemberDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "streamChannelId" in value;
    isInstance = isInstance && "recent" in value;
    isInstance = isInstance && "channelMemberId" in value;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "otherUserId" in value;
    isInstance = isInstance && "unlimitedMessages" in value;
    isInstance = isInstance && "tipSent" in value;
    isInstance = isInstance && "tipRecieved" in value;
    isInstance = isInstance && "unreadTip" in value;

    return isInstance;
}

export function ChannelMemberDtoFromJSON(json: any): ChannelMemberDto {
    return ChannelMemberDtoFromJSONTyped(json, false);
}

export function ChannelMemberDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChannelMemberDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'channelId': !exists(json, 'channelId') ? undefined : json['channelId'],
        'streamChannelId': json['streamChannelId'],
        'recent': (new Date(json['recent'])),
        'channelMemberId': json['channelMemberId'],
        'userId': json['userId'],
        'otherUserId': json['otherUserId'],
        'unlimitedMessages': json['unlimitedMessages'],
        'tipSent': json['tipSent'],
        'tipRecieved': json['tipRecieved'],
        'unreadTip': json['unreadTip'],
        'otherUserUsername': !exists(json, 'otherUserUsername') ? undefined : json['otherUserUsername'],
        'otherUserDisplayName': !exists(json, 'otherUserDisplayName') ? undefined : json['otherUserDisplayName'],
    };
}

export function ChannelMemberDtoToJSON(value?: ChannelMemberDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'channelId': value.channelId,
        'streamChannelId': value.streamChannelId,
        'recent': (value.recent.toISOString()),
        'channelMemberId': value.channelMemberId,
        'userId': value.userId,
        'otherUserId': value.otherUserId,
        'unlimitedMessages': value.unlimitedMessages,
        'tipSent': value.tipSent,
        'tipRecieved': value.tipRecieved,
        'unreadTip': value.unreadTip,
        'otherUserUsername': value.otherUserUsername,
        'otherUserDisplayName': value.otherUserDisplayName,
    };
}


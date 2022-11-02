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
import type { CreateBatchMessageRequestDto } from './CreateBatchMessageRequestDto';
import {
    CreateBatchMessageRequestDtoFromJSON,
    CreateBatchMessageRequestDtoFromJSONTyped,
    CreateBatchMessageRequestDtoToJSON,
} from './CreateBatchMessageRequestDto';
import type { CreatePostRequestDto } from './CreatePostRequestDto';
import {
    CreatePostRequestDtoFromJSON,
    CreatePostRequestDtoFromJSONTyped,
    CreatePostRequestDtoToJSON,
} from './CreatePostRequestDto';
import type { SendMessageRequestDto } from './SendMessageRequestDto';
import {
    SendMessageRequestDtoFromJSON,
    SendMessageRequestDtoFromJSONTyped,
    SendMessageRequestDtoToJSON,
} from './SendMessageRequestDto';

/**
 * 
 * @export
 * @interface ScheduledEventDto
 */
export interface ScheduledEventDto {
    /**
     * 
     * @type {string}
     * @memberof ScheduledEventDto
     */
    scheduledEventId: string;
    /**
     * 
     * @type {CreatePostRequestDto}
     * @memberof ScheduledEventDto
     */
    createPost?: CreatePostRequestDto;
    /**
     * 
     * @type {SendMessageRequestDto}
     * @memberof ScheduledEventDto
     */
    sendMessage?: SendMessageRequestDto;
    /**
     * 
     * @type {CreateBatchMessageRequestDto}
     * @memberof ScheduledEventDto
     */
    batchMessage?: CreateBatchMessageRequestDto;
    /**
     * 
     * @type {string}
     * @memberof ScheduledEventDto
     */
    type: ScheduledEventDtoTypeEnum;
    /**
     * 
     * @type {Date}
     * @memberof ScheduledEventDto
     */
    scheduledAt: Date;
    /**
     * 
     * @type {boolean}
     * @memberof ScheduledEventDto
     */
    processed: boolean;
}


/**
 * @export
 */
export const ScheduledEventDtoTypeEnum = {
    CreatePost: 'create_post',
    SendMessage: 'send_message',
    BatchMessage: 'batch_message'
} as const;
export type ScheduledEventDtoTypeEnum = typeof ScheduledEventDtoTypeEnum[keyof typeof ScheduledEventDtoTypeEnum];


/**
 * Check if a given object implements the ScheduledEventDto interface.
 */
export function instanceOfScheduledEventDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "scheduledEventId" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "scheduledAt" in value;
    isInstance = isInstance && "processed" in value;

    return isInstance;
}

export function ScheduledEventDtoFromJSON(json: any): ScheduledEventDto {
    return ScheduledEventDtoFromJSONTyped(json, false);
}

export function ScheduledEventDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ScheduledEventDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'scheduledEventId': json['scheduledEventId'],
        'createPost': !exists(json, 'createPost') ? undefined : CreatePostRequestDtoFromJSON(json['createPost']),
        'sendMessage': !exists(json, 'sendMessage') ? undefined : SendMessageRequestDtoFromJSON(json['sendMessage']),
        'batchMessage': !exists(json, 'batchMessage') ? undefined : CreateBatchMessageRequestDtoFromJSON(json['batchMessage']),
        'type': json['type'],
        'scheduledAt': (new Date(json['scheduledAt'])),
        'processed': json['processed'],
    };
}

export function ScheduledEventDtoToJSON(value?: ScheduledEventDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'scheduledEventId': value.scheduledEventId,
        'createPost': CreatePostRequestDtoToJSON(value.createPost),
        'sendMessage': SendMessageRequestDtoToJSON(value.sendMessage),
        'batchMessage': CreateBatchMessageRequestDtoToJSON(value.batchMessage),
        'type': value.type,
        'scheduledAt': (value.scheduledAt.toISOString()),
        'processed': value.processed,
    };
}


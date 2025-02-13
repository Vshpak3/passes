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
 * @interface GetNotificationsRequestDto
 */
export interface GetNotificationsRequestDto {
    /**
     * 
     * @type {string}
     * @memberof GetNotificationsRequestDto
     */
    type: GetNotificationsRequestDtoTypeEnum;
    /**
     * 
     * @type {number}
     * @memberof GetNotificationsRequestDto
     */
    offset: number;
    /**
     * 
     * @type {number}
     * @memberof GetNotificationsRequestDto
     */
    limit: number;
}


/**
 * @export
 */
export const GetNotificationsRequestDtoTypeEnum = {
    Comment: 'comment',
    Mention: 'mention',
    Subscription: 'subscription',
    Payment: 'payment',
    Other: 'other'
} as const;
export type GetNotificationsRequestDtoTypeEnum = typeof GetNotificationsRequestDtoTypeEnum[keyof typeof GetNotificationsRequestDtoTypeEnum];


/**
 * Check if a given object implements the GetNotificationsRequestDto interface.
 */
export function instanceOfGetNotificationsRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "offset" in value;
    isInstance = isInstance && "limit" in value;

    return isInstance;
}

export function GetNotificationsRequestDtoFromJSON(json: any): GetNotificationsRequestDto {
    return GetNotificationsRequestDtoFromJSONTyped(json, false);
}

export function GetNotificationsRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetNotificationsRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': json['type'],
        'offset': json['offset'],
        'limit': json['limit'],
    };
}

export function GetNotificationsRequestDtoToJSON(value?: GetNotificationsRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': value.type,
        'offset': value.offset,
        'limit': value.limit,
    };
}


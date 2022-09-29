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
 * @interface GetNotificationSettingsResponseDto
 */
export interface GetNotificationSettingsResponseDto {
    /**
     * 
     * @type {boolean}
     * @memberof GetNotificationSettingsResponseDto
     */
    directMessageEmails: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof GetNotificationSettingsResponseDto
     */
    passesEmails: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof GetNotificationSettingsResponseDto
     */
    paymentEmails: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof GetNotificationSettingsResponseDto
     */
    postEmails: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof GetNotificationSettingsResponseDto
     */
    marketingEmails: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof GetNotificationSettingsResponseDto
     */
    mentionEmails: boolean;
}

/**
 * Check if a given object implements the GetNotificationSettingsResponseDto interface.
 */
export function instanceOfGetNotificationSettingsResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "directMessageEmails" in value;
    isInstance = isInstance && "passesEmails" in value;
    isInstance = isInstance && "paymentEmails" in value;
    isInstance = isInstance && "postEmails" in value;
    isInstance = isInstance && "marketingEmails" in value;
    isInstance = isInstance && "mentionEmails" in value;

    return isInstance;
}

export function GetNotificationSettingsResponseDtoFromJSON(json: any): GetNotificationSettingsResponseDto {
    return GetNotificationSettingsResponseDtoFromJSONTyped(json, false);
}

export function GetNotificationSettingsResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetNotificationSettingsResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'directMessageEmails': json['directMessageEmails'],
        'passesEmails': json['passesEmails'],
        'paymentEmails': json['paymentEmails'],
        'postEmails': json['postEmails'],
        'marketingEmails': json['marketingEmails'],
        'mentionEmails': json['mentionEmails'],
    };
}

export function GetNotificationSettingsResponseDtoToJSON(value?: GetNotificationSettingsResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'directMessageEmails': value.directMessageEmails,
        'passesEmails': value.passesEmails,
        'paymentEmails': value.paymentEmails,
        'postEmails': value.postEmails,
        'marketingEmails': value.marketingEmails,
        'mentionEmails': value.mentionEmails,
    };
}


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
 * @interface UpdateCreatorSettingsRequestDto
 */
export interface UpdateCreatorSettingsRequestDto {
    /**
     * 
     * @type {number}
     * @memberof UpdateCreatorSettingsRequestDto
     */
    minimumTipAmount?: number | null;
    /**
     * 
     * @type {string}
     * @memberof UpdateCreatorSettingsRequestDto
     */
    payoutFrequency?: UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum;
    /**
     * 
     * @type {string}
     * @memberof UpdateCreatorSettingsRequestDto
     */
    welcomeMessage?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof UpdateCreatorSettingsRequestDto
     */
    allowCommentsOnPosts?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof UpdateCreatorSettingsRequestDto
     */
    showFollowerCount?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof UpdateCreatorSettingsRequestDto
     */
    showMediaCount?: boolean;
}


/**
 * @export
 */
export const UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum = {
    Manual: 'manual',
    TwoWeeks: 'two weeks',
    OneWeek: 'one week'
} as const;
export type UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum = typeof UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum[keyof typeof UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum];


/**
 * Check if a given object implements the UpdateCreatorSettingsRequestDto interface.
 */
export function instanceOfUpdateCreatorSettingsRequestDto(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function UpdateCreatorSettingsRequestDtoFromJSON(json: any): UpdateCreatorSettingsRequestDto {
    return UpdateCreatorSettingsRequestDtoFromJSONTyped(json, false);
}

export function UpdateCreatorSettingsRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateCreatorSettingsRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'minimumTipAmount': !exists(json, 'minimumTipAmount') ? undefined : json['minimumTipAmount'],
        'payoutFrequency': !exists(json, 'payoutFrequency') ? undefined : json['payoutFrequency'],
        'welcomeMessage': !exists(json, 'welcomeMessage') ? undefined : json['welcomeMessage'],
        'allowCommentsOnPosts': !exists(json, 'allowCommentsOnPosts') ? undefined : json['allowCommentsOnPosts'],
        'showFollowerCount': !exists(json, 'showFollowerCount') ? undefined : json['showFollowerCount'],
        'showMediaCount': !exists(json, 'showMediaCount') ? undefined : json['showMediaCount'],
    };
}

export function UpdateCreatorSettingsRequestDtoToJSON(value?: UpdateCreatorSettingsRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'minimumTipAmount': value.minimumTipAmount,
        'payoutFrequency': value.payoutFrequency,
        'welcomeMessage': value.welcomeMessage,
        'allowCommentsOnPosts': value.allowCommentsOnPosts,
        'showFollowerCount': value.showFollowerCount,
        'showMediaCount': value.showMediaCount,
    };
}


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
 * @interface CreateProfileDto
 */
export interface CreateProfileDto {
    /**
     * 
     * @type {string}
     * @memberof CreateProfileDto
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateProfileDto
     */
    profileImageUrl?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateProfileDto
     */
    instagramUrl?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateProfileDto
     */
    tiktokUrl?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateProfileDto
     */
    youtubeUrl?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateProfileDto
     */
    discordUrl?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateProfileDto
     */
    twitchUrl?: string;
}

export function CreateProfileDtoFromJSON(json: any): CreateProfileDto {
    return CreateProfileDtoFromJSONTyped(json, false);
}

export function CreateProfileDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateProfileDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'description': !exists(json, 'description') ? undefined : json['description'],
        'profileImageUrl': !exists(json, 'profileImageUrl') ? undefined : json['profileImageUrl'],
        'instagramUrl': !exists(json, 'instagramUrl') ? undefined : json['instagramUrl'],
        'tiktokUrl': !exists(json, 'tiktokUrl') ? undefined : json['tiktokUrl'],
        'youtubeUrl': !exists(json, 'youtubeUrl') ? undefined : json['youtubeUrl'],
        'discordUrl': !exists(json, 'discordUrl') ? undefined : json['discordUrl'],
        'twitchUrl': !exists(json, 'twitchUrl') ? undefined : json['twitchUrl'],
    };
}

export function CreateProfileDtoToJSON(value?: CreateProfileDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'description': value.description,
        'profileImageUrl': value.profileImageUrl,
        'instagramUrl': value.instagramUrl,
        'tiktokUrl': value.tiktokUrl,
        'youtubeUrl': value.youtubeUrl,
        'discordUrl': value.discordUrl,
        'twitchUrl': value.twitchUrl,
    };
}


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
 * @interface CreateOrUpdateProfileRequestDto
 */
export interface CreateOrUpdateProfileRequestDto {
    /**
     * 
     * @type {string}
     * @memberof CreateOrUpdateProfileRequestDto
     */
    coverTitle?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CreateOrUpdateProfileRequestDto
     */
    coverDescription?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CreateOrUpdateProfileRequestDto
     */
    description?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CreateOrUpdateProfileRequestDto
     */
    discordUsername?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CreateOrUpdateProfileRequestDto
     */
    facebookUsername?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CreateOrUpdateProfileRequestDto
     */
    instagramUsername?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CreateOrUpdateProfileRequestDto
     */
    tiktokUsername?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CreateOrUpdateProfileRequestDto
     */
    twitchUsername?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CreateOrUpdateProfileRequestDto
     */
    twitterUsername?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CreateOrUpdateProfileRequestDto
     */
    youtubeUsername?: string | null;
}

/**
 * Check if a given object implements the CreateOrUpdateProfileRequestDto interface.
 */
export function instanceOfCreateOrUpdateProfileRequestDto(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function CreateOrUpdateProfileRequestDtoFromJSON(json: any): CreateOrUpdateProfileRequestDto {
    return CreateOrUpdateProfileRequestDtoFromJSONTyped(json, false);
}

export function CreateOrUpdateProfileRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateOrUpdateProfileRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'coverTitle': !exists(json, 'coverTitle') ? undefined : json['coverTitle'],
        'coverDescription': !exists(json, 'coverDescription') ? undefined : json['coverDescription'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'discordUsername': !exists(json, 'discordUsername') ? undefined : json['discordUsername'],
        'facebookUsername': !exists(json, 'facebookUsername') ? undefined : json['facebookUsername'],
        'instagramUsername': !exists(json, 'instagramUsername') ? undefined : json['instagramUsername'],
        'tiktokUsername': !exists(json, 'tiktokUsername') ? undefined : json['tiktokUsername'],
        'twitchUsername': !exists(json, 'twitchUsername') ? undefined : json['twitchUsername'],
        'twitterUsername': !exists(json, 'twitterUsername') ? undefined : json['twitterUsername'],
        'youtubeUsername': !exists(json, 'youtubeUsername') ? undefined : json['youtubeUsername'],
    };
}

export function CreateOrUpdateProfileRequestDtoToJSON(value?: CreateOrUpdateProfileRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'coverTitle': value.coverTitle,
        'coverDescription': value.coverDescription,
        'description': value.description,
        'discordUsername': value.discordUsername,
        'facebookUsername': value.facebookUsername,
        'instagramUsername': value.instagramUsername,
        'tiktokUsername': value.tiktokUsername,
        'twitchUsername': value.twitchUsername,
        'twitterUsername': value.twitterUsername,
        'youtubeUsername': value.youtubeUsername,
    };
}


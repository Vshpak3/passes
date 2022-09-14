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
 * @interface GetPassResponseDto
 */
export interface GetPassResponseDto {
    /**
     * 
     * @type {string}
     * @memberof GetPassResponseDto
     */
    passId: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassResponseDto
     */
    creatorId?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassResponseDto
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassResponseDto
     */
    description: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassResponseDto
     */
    type: GetPassResponseDtoTypeEnum;
    /**
     * 
     * @type {number}
     * @memberof GetPassResponseDto
     */
    price: number;
    /**
     * 
     * @type {number}
     * @memberof GetPassResponseDto
     */
    duration?: number;
    /**
     * 
     * @type {number}
     * @memberof GetPassResponseDto
     */
    totalSupply: number;
    /**
     * 
     * @type {number}
     * @memberof GetPassResponseDto
     */
    remainingSupply: number;
    /**
     * 
     * @type {boolean}
     * @memberof GetPassResponseDto
     */
    freetrial: boolean;
    /**
     * 
     * @type {Date}
     * @memberof GetPassResponseDto
     */
    pinnedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof GetPassResponseDto
     */
    createdAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof GetPassResponseDto
     */
    creatorUsername?: string;
    /**
     * 
     * @type {string}
     * @memberof GetPassResponseDto
     */
    creatorDisplayName?: string;
}


/**
 * @export
 */
export const GetPassResponseDtoTypeEnum = {
    Subscription: 'subscription',
    Lifetime: 'lifetime',
    External: 'external'
} as const;
export type GetPassResponseDtoTypeEnum = typeof GetPassResponseDtoTypeEnum[keyof typeof GetPassResponseDtoTypeEnum];


/**
 * Check if a given object implements the GetPassResponseDto interface.
 */
export function instanceOfGetPassResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "passId" in value;
    isInstance = isInstance && "title" in value;
    isInstance = isInstance && "description" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "price" in value;
    isInstance = isInstance && "totalSupply" in value;
    isInstance = isInstance && "remainingSupply" in value;
    isInstance = isInstance && "freetrial" in value;

    return isInstance;
}

export function GetPassResponseDtoFromJSON(json: any): GetPassResponseDto {
    return GetPassResponseDtoFromJSONTyped(json, false);
}

export function GetPassResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetPassResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'passId': json['passId'],
        'creatorId': !exists(json, 'creatorId') ? undefined : json['creatorId'],
        'title': json['title'],
        'description': json['description'],
        'type': json['type'],
        'price': json['price'],
        'duration': !exists(json, 'duration') ? undefined : json['duration'],
        'totalSupply': json['totalSupply'],
        'remainingSupply': json['remainingSupply'],
        'freetrial': json['freetrial'],
        'pinnedAt': !exists(json, 'pinnedAt') ? undefined : (new Date(json['pinnedAt'])),
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'creatorUsername': !exists(json, 'creatorUsername') ? undefined : json['creatorUsername'],
        'creatorDisplayName': !exists(json, 'creatorDisplayName') ? undefined : json['creatorDisplayName'],
    };
}

export function GetPassResponseDtoToJSON(value?: GetPassResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'passId': value.passId,
        'creatorId': value.creatorId,
        'title': value.title,
        'description': value.description,
        'type': value.type,
        'price': value.price,
        'duration': value.duration,
        'totalSupply': value.totalSupply,
        'remainingSupply': value.remainingSupply,
        'freetrial': value.freetrial,
        'pinnedAt': value.pinnedAt === undefined ? undefined : (value.pinnedAt.toISOString()),
        'createdAt': value.createdAt === undefined ? undefined : (value.createdAt.toISOString()),
        'creatorUsername': value.creatorUsername,
        'creatorDisplayName': value.creatorDisplayName,
    };
}


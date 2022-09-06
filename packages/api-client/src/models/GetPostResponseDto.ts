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
import {
    ContentDto,
    ContentDtoFromJSON,
    ContentDtoFromJSONTyped,
    ContentDtoToJSON,
} from './ContentDto';

/**
 * 
 * @export
 * @interface GetPostResponseDto
 */
export interface GetPostResponseDto {
    /**
     * 
     * @type {string}
     * @memberof GetPostResponseDto
     */
    id: string;
    /**
     * 
     * @type {boolean}
     * @memberof GetPostResponseDto
     */
    paywall: boolean;
    /**
     * 
     * @type {string}
     * @memberof GetPostResponseDto
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof GetPostResponseDto
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof GetPostResponseDto
     */
    displayName: string;
    /**
     * 
     * @type {string}
     * @memberof GetPostResponseDto
     */
    text: string;
    /**
     * 
     * @type {Array<ContentDto>}
     * @memberof GetPostResponseDto
     */
    content?: Array<ContentDto>;
    /**
     * 
     * @type {number}
     * @memberof GetPostResponseDto
     */
    numLikes: number;
    /**
     * 
     * @type {number}
     * @memberof GetPostResponseDto
     */
    numComments: number;
    /**
     * 
     * @type {number}
     * @memberof GetPostResponseDto
     */
    numPurchases: number;
    /**
     * 
     * @type {boolean}
     * @memberof GetPostResponseDto
     */
    isLiked?: boolean;
    /**
     * 
     * @type {Date}
     * @memberof GetPostResponseDto
     */
    createdAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof GetPostResponseDto
     */
    updatedAt: Date;
    /**
     * 
     * @type {string}
     * @memberof GetPostResponseDto
     */
    scheduledAt?: string;
    /**
     * 
     * @type {Date}
     * @memberof GetPostResponseDto
     */
    expiresAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof GetPostResponseDto
     */
    price?: string;
    /**
     * 
     * @type {number}
     * @memberof GetPostResponseDto
     */
    totalTipAmount?: number;
}

export function GetPostResponseDtoFromJSON(json: any): GetPostResponseDto {
    return GetPostResponseDtoFromJSONTyped(json, false);
}

export function GetPostResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetPostResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'paywall': json['paywall'],
        'userId': json['userId'],
        'username': json['username'],
        'displayName': json['displayName'],
        'text': json['text'],
        'content': !exists(json, 'content') ? undefined : ((json['content'] as Array<any>).map(ContentDtoFromJSON)),
        'numLikes': json['numLikes'],
        'numComments': json['numComments'],
        'numPurchases': json['numPurchases'],
        'isLiked': !exists(json, 'isLiked') ? undefined : json['isLiked'],
        'createdAt': (new Date(json['createdAt'])),
        'updatedAt': (new Date(json['updatedAt'])),
        'scheduledAt': !exists(json, 'scheduledAt') ? undefined : json['scheduledAt'],
        'expiresAt': !exists(json, 'expiresAt') ? undefined : (new Date(json['expiresAt'])),
        'price': !exists(json, 'price') ? undefined : json['price'],
        'totalTipAmount': !exists(json, 'totalTipAmount') ? undefined : json['totalTipAmount'],
    };
}

export function GetPostResponseDtoToJSON(value?: GetPostResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'paywall': value.paywall,
        'userId': value.userId,
        'username': value.username,
        'displayName': value.displayName,
        'text': value.text,
        'content': value.content === undefined ? undefined : ((value.content as Array<any>).map(ContentDtoToJSON)),
        'numLikes': value.numLikes,
        'numComments': value.numComments,
        'numPurchases': value.numPurchases,
        'isLiked': value.isLiked,
        'createdAt': (value.createdAt.toISOString()),
        'updatedAt': (value.updatedAt.toISOString()),
        'scheduledAt': value.scheduledAt,
        'expiresAt': value.expiresAt === undefined ? undefined : (value.expiresAt.toISOString()),
        'price': value.price,
        'totalTipAmount': value.totalTipAmount,
    };
}


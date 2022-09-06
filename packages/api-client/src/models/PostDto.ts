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
 * @interface PostDto
 */
export interface PostDto {
    /**
     * 
     * @type {string}
     * @memberof PostDto
     */
    id: string;
    /**
     * 
     * @type {boolean}
     * @memberof PostDto
     */
    paywall: boolean;
    /**
     * 
     * @type {string}
     * @memberof PostDto
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof PostDto
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof PostDto
     */
    displayName: string;
    /**
     * 
     * @type {string}
     * @memberof PostDto
     */
    text: string;
    /**
     * 
     * @type {Array<ContentDto>}
     * @memberof PostDto
     */
    content?: Array<ContentDto>;
    /**
     * 
     * @type {number}
     * @memberof PostDto
     */
    numLikes: number;
    /**
     * 
     * @type {number}
     * @memberof PostDto
     */
    numComments: number;
    /**
     * 
     * @type {number}
     * @memberof PostDto
     */
    numPurchases: number;
    /**
     * 
     * @type {boolean}
     * @memberof PostDto
     */
    isLiked?: boolean;
    /**
     * 
     * @type {Date}
     * @memberof PostDto
     */
    createdAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof PostDto
     */
    updatedAt: Date;
    /**
     * 
     * @type {string}
     * @memberof PostDto
     */
    scheduledAt?: string;
    /**
     * 
     * @type {Date}
     * @memberof PostDto
     */
    expiresAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof PostDto
     */
    price?: string;
    /**
     * 
     * @type {number}
     * @memberof PostDto
     */
    totalTipAmount?: number;
}

export function PostDtoFromJSON(json: any): PostDto {
    return PostDtoFromJSONTyped(json, false);
}

export function PostDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PostDto {
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

export function PostDtoToJSON(value?: PostDto | null): any {
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


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
    GetContentResponseDto,
    GetContentResponseDtoFromJSON,
    GetContentResponseDtoFromJSONTyped,
    GetContentResponseDtoToJSON,
} from './GetContentResponseDto';

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
    text: string;
    /**
     * 
     * @type {Array<GetContentResponseDto>}
     * @memberof GetPostResponseDto
     */
    content?: Array<GetContentResponseDto>;
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
    isLiked: boolean;
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
     * @type {number}
     * @memberof GetPostResponseDto
     */
    expiresAt?: number;
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
    totalTipAmount: number;
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
        'text': json['text'],
        'content': !exists(json, 'content') ? undefined : ((json['content'] as Array<any>).map(GetContentResponseDtoFromJSON)),
        'numLikes': json['numLikes'],
        'numComments': json['numComments'],
        'numPurchases': json['numPurchases'],
        'isLiked': json['isLiked'],
        'createdAt': (new Date(json['createdAt'])),
        'updatedAt': (new Date(json['updatedAt'])),
        'scheduledAt': !exists(json, 'scheduledAt') ? undefined : json['scheduledAt'],
        'expiresAt': !exists(json, 'expiresAt') ? undefined : json['expiresAt'],
        'price': !exists(json, 'price') ? undefined : json['price'],
        'totalTipAmount': json['totalTipAmount'],
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
        'text': value.text,
        'content': value.content === undefined ? undefined : ((value.content as Array<any>).map(GetContentResponseDtoToJSON)),
        'numLikes': value.numLikes,
        'numComments': value.numComments,
        'numPurchases': value.numPurchases,
        'isLiked': value.isLiked,
        'createdAt': (value.createdAt.toISOString()),
        'updatedAt': (value.updatedAt.toISOString()),
        'scheduledAt': value.scheduledAt,
        'expiresAt': value.expiresAt,
        'price': value.price,
        'totalTipAmount': value.totalTipAmount,
    };
}


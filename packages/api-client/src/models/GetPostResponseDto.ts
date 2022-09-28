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
import type { ContentDto } from './ContentDto';
import {
    ContentDtoFromJSON,
    ContentDtoFromJSONTyped,
    ContentDtoToJSON,
} from './ContentDto';
import type { TagDto } from './TagDto';
import {
    TagDtoFromJSON,
    TagDtoFromJSONTyped,
    TagDtoToJSON,
} from './TagDto';

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
    postId: string;
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
     * @type {Array<TagDto>}
     * @memberof GetPostResponseDto
     */
    tags: Array<TagDto>;
    /**
     * 
     * @type {Array<ContentDto>}
     * @memberof GetPostResponseDto
     */
    content?: Array<ContentDto>;
    /**
     * 
     * @type {Array<string>}
     * @memberof GetPostResponseDto
     */
    passIds: Array<string>;
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
     * @type {number}
     * @memberof GetPostResponseDto
     */
    earningsPurchases: number;
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
     * @type {Date}
     * @memberof GetPostResponseDto
     */
    scheduledAt?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof GetPostResponseDto
     */
    expiresAt?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof GetPostResponseDto
     */
    price?: number;
    /**
     * 
     * @type {number}
     * @memberof GetPostResponseDto
     */
    totalTipAmount?: number;
}

/**
 * Check if a given object implements the GetPostResponseDto interface.
 */
export function instanceOfGetPostResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "postId" in value;
    isInstance = isInstance && "paywall" in value;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "username" in value;
    isInstance = isInstance && "displayName" in value;
    isInstance = isInstance && "text" in value;
    isInstance = isInstance && "tags" in value;
    isInstance = isInstance && "passIds" in value;
    isInstance = isInstance && "numLikes" in value;
    isInstance = isInstance && "numComments" in value;
    isInstance = isInstance && "numPurchases" in value;
    isInstance = isInstance && "earningsPurchases" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "updatedAt" in value;

    return isInstance;
}

export function GetPostResponseDtoFromJSON(json: any): GetPostResponseDto {
    return GetPostResponseDtoFromJSONTyped(json, false);
}

export function GetPostResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetPostResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'postId': json['postId'],
        'paywall': json['paywall'],
        'userId': json['userId'],
        'username': json['username'],
        'displayName': json['displayName'],
        'text': json['text'],
        'tags': ((json['tags'] as Array<any>).map(TagDtoFromJSON)),
        'content': !exists(json, 'content') ? undefined : ((json['content'] as Array<any>).map(ContentDtoFromJSON)),
        'passIds': json['passIds'],
        'numLikes': json['numLikes'],
        'numComments': json['numComments'],
        'numPurchases': json['numPurchases'],
        'earningsPurchases': json['earningsPurchases'],
        'isLiked': !exists(json, 'isLiked') ? undefined : json['isLiked'],
        'createdAt': json['createdAt'],
        'updatedAt': json['updatedAt'],
        'scheduledAt': !exists(json, 'scheduledAt') ? undefined : json['scheduledAt'],
        'expiresAt': !exists(json, 'expiresAt') ? undefined : json['expiresAt'],
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
        
        'postId': value.postId,
        'paywall': value.paywall,
        'userId': value.userId,
        'username': value.username,
        'displayName': value.displayName,
        'text': value.text,
        'tags': ((value.tags as Array<any>).map(TagDtoToJSON)),
        'content': value.content === undefined ? undefined : ((value.content as Array<any>).map(ContentDtoToJSON)),
        'passIds': value.passIds,
        'numLikes': value.numLikes,
        'numComments': value.numComments,
        'numPurchases': value.numPurchases,
        'earningsPurchases': value.earningsPurchases,
        'isLiked': value.isLiked,
        'createdAt': value.createdAt,
        'updatedAt': value.updatedAt,
        'scheduledAt': value.scheduledAt,
        'expiresAt': value.expiresAt,
        'price': value.price,
        'totalTipAmount': value.totalTipAmount,
    };
}


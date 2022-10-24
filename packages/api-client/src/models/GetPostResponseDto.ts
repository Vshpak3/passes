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
    postId: string;
    /**
     * 
     * @type {boolean}
     * @memberof GetPostResponseDto
     */
    purchasable: boolean;
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
    contents?: Array<ContentDto>;
    /**
     * 
     * @type {number}
     * @memberof GetPostResponseDto
     */
    previewIndex: number;
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
    expiresAt?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof GetPostResponseDto
     */
    deletedAt?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof GetPostResponseDto
     */
    pinnedAt?: Date | null;
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
    /**
     * 
     * @type {boolean}
     * @memberof GetPostResponseDto
     */
    isOwner: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof GetPostResponseDto
     */
    paid: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof GetPostResponseDto
     */
    paying: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof GetPostResponseDto
     */
    contentProcessed: boolean;
    /**
     * 
     * @type {number}
     * @memberof GetPostResponseDto
     */
    yourTips: number;
}

/**
 * Check if a given object implements the GetPostResponseDto interface.
 */
export function instanceOfGetPostResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "username" in value;
    isInstance = isInstance && "displayName" in value;
    isInstance = isInstance && "postId" in value;
    isInstance = isInstance && "purchasable" in value;
    isInstance = isInstance && "text" in value;
    isInstance = isInstance && "tags" in value;
    isInstance = isInstance && "previewIndex" in value;
    isInstance = isInstance && "passIds" in value;
    isInstance = isInstance && "numLikes" in value;
    isInstance = isInstance && "numComments" in value;
    isInstance = isInstance && "numPurchases" in value;
    isInstance = isInstance && "earningsPurchases" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "updatedAt" in value;
    isInstance = isInstance && "isOwner" in value;
    isInstance = isInstance && "paid" in value;
    isInstance = isInstance && "paying" in value;
    isInstance = isInstance && "contentProcessed" in value;
    isInstance = isInstance && "yourTips" in value;

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
        
        'userId': json['userId'],
        'username': json['username'],
        'displayName': json['displayName'],
        'postId': json['postId'],
        'purchasable': json['purchasable'],
        'text': json['text'],
        'tags': ((json['tags'] as Array<any>).map(TagDtoFromJSON)),
        'contents': !exists(json, 'contents') ? undefined : ((json['contents'] as Array<any>).map(ContentDtoFromJSON)),
        'previewIndex': json['previewIndex'],
        'passIds': json['passIds'],
        'numLikes': json['numLikes'],
        'numComments': json['numComments'],
        'numPurchases': json['numPurchases'],
        'earningsPurchases': json['earningsPurchases'],
        'isLiked': !exists(json, 'isLiked') ? undefined : json['isLiked'],
        'createdAt': (new Date(json['createdAt'])),
        'updatedAt': (new Date(json['updatedAt'])),
        'expiresAt': !exists(json, 'expiresAt') ? undefined : (json['expiresAt'] === null ? null : new Date(json['expiresAt'])),
        'deletedAt': !exists(json, 'deletedAt') ? undefined : (json['deletedAt'] === null ? null : new Date(json['deletedAt'])),
        'pinnedAt': !exists(json, 'pinnedAt') ? undefined : (json['pinnedAt'] === null ? null : new Date(json['pinnedAt'])),
        'price': !exists(json, 'price') ? undefined : json['price'],
        'totalTipAmount': !exists(json, 'totalTipAmount') ? undefined : json['totalTipAmount'],
        'isOwner': json['isOwner'],
        'paid': json['paid'],
        'paying': json['paying'],
        'contentProcessed': json['contentProcessed'],
        'yourTips': json['yourTips'],
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
        
        'userId': value.userId,
        'username': value.username,
        'displayName': value.displayName,
        'postId': value.postId,
        'purchasable': value.purchasable,
        'text': value.text,
        'tags': ((value.tags as Array<any>).map(TagDtoToJSON)),
        'contents': value.contents === undefined ? undefined : ((value.contents as Array<any>).map(ContentDtoToJSON)),
        'previewIndex': value.previewIndex,
        'passIds': value.passIds,
        'numLikes': value.numLikes,
        'numComments': value.numComments,
        'numPurchases': value.numPurchases,
        'earningsPurchases': value.earningsPurchases,
        'isLiked': value.isLiked,
        'createdAt': (value.createdAt.toISOString()),
        'updatedAt': (value.updatedAt.toISOString()),
        'expiresAt': value.expiresAt === undefined ? undefined : (value.expiresAt === null ? null : value.expiresAt.toISOString()),
        'deletedAt': value.deletedAt === undefined ? undefined : (value.deletedAt === null ? null : value.deletedAt.toISOString()),
        'pinnedAt': value.pinnedAt === undefined ? undefined : (value.pinnedAt === null ? null : value.pinnedAt.toISOString()),
        'price': value.price,
        'totalTipAmount': value.totalTipAmount,
        'isOwner': value.isOwner,
        'paid': value.paid,
        'paying': value.paying,
        'contentProcessed': value.contentProcessed,
        'yourTips': value.yourTips,
    };
}


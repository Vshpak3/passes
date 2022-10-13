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
 * @interface PassHolderDto
 */
export interface PassHolderDto {
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    passId: string;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    creatorId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    description: string;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    symbol: string;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    type: PassHolderDtoTypeEnum;
    /**
     * 
     * @type {number}
     * @memberof PassHolderDto
     */
    price: number;
    /**
     * 
     * @type {number}
     * @memberof PassHolderDto
     */
    ethPrice: number | null;
    /**
     * 
     * @type {number}
     * @memberof PassHolderDto
     */
    duration?: number | null;
    /**
     * 
     * @type {number}
     * @memberof PassHolderDto
     */
    totalSupply: number | null;
    /**
     * 
     * @type {number}
     * @memberof PassHolderDto
     */
    remainingSupply: number | null;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    chain: PassHolderDtoChainEnum;
    /**
     * 
     * @type {boolean}
     * @memberof PassHolderDto
     */
    freetrial: boolean;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    collectionAddress: string | null;
    /**
     * 
     * @type {Date}
     * @memberof PassHolderDto
     */
    pinnedAt?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof PassHolderDto
     */
    createdAt: Date;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    creatorUsername?: string;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    creatorDisplayName?: string;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    imageType: PassHolderDtoImageTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    animationType: PassHolderDtoAnimationTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    passHolderId: string;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    holderId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    walletId?: string | null;
    /**
     * 
     * @type {number}
     * @memberof PassHolderDto
     */
    messages?: number | null;
    /**
     * 
     * @type {Date}
     * @memberof PassHolderDto
     */
    expiresAt?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    holderUsername?: string;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    holderDisplayName?: string;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    address: string;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    tokenId?: string | null;
}


/**
 * @export
 */
export const PassHolderDtoTypeEnum = {
    Subscription: 'subscription',
    Lifetime: 'lifetime',
    External: 'external'
} as const;
export type PassHolderDtoTypeEnum = typeof PassHolderDtoTypeEnum[keyof typeof PassHolderDtoTypeEnum];

/**
 * @export
 */
export const PassHolderDtoChainEnum = {
    Eth: 'eth',
    Sol: 'sol',
    Avax: 'avax',
    Matic: 'matic'
} as const;
export type PassHolderDtoChainEnum = typeof PassHolderDtoChainEnum[keyof typeof PassHolderDtoChainEnum];

/**
 * @export
 */
export const PassHolderDtoImageTypeEnum = {
    Jpeg: 'jpeg',
    Png: 'png',
    Gif: 'gif'
} as const;
export type PassHolderDtoImageTypeEnum = typeof PassHolderDtoImageTypeEnum[keyof typeof PassHolderDtoImageTypeEnum];

/**
 * @export
 */
export const PassHolderDtoAnimationTypeEnum = {
    Mp4: 'mp4',
    Mov: 'mov'
} as const;
export type PassHolderDtoAnimationTypeEnum = typeof PassHolderDtoAnimationTypeEnum[keyof typeof PassHolderDtoAnimationTypeEnum];


/**
 * Check if a given object implements the PassHolderDto interface.
 */
export function instanceOfPassHolderDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "passId" in value;
    isInstance = isInstance && "title" in value;
    isInstance = isInstance && "description" in value;
    isInstance = isInstance && "symbol" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "price" in value;
    isInstance = isInstance && "ethPrice" in value;
    isInstance = isInstance && "totalSupply" in value;
    isInstance = isInstance && "remainingSupply" in value;
    isInstance = isInstance && "chain" in value;
    isInstance = isInstance && "freetrial" in value;
    isInstance = isInstance && "collectionAddress" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "imageType" in value;
    isInstance = isInstance && "animationType" in value;
    isInstance = isInstance && "passHolderId" in value;
    isInstance = isInstance && "address" in value;

    return isInstance;
}

export function PassHolderDtoFromJSON(json: any): PassHolderDto {
    return PassHolderDtoFromJSONTyped(json, false);
}

export function PassHolderDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PassHolderDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'passId': json['passId'],
        'creatorId': !exists(json, 'creatorId') ? undefined : json['creatorId'],
        'title': json['title'],
        'description': json['description'],
        'symbol': json['symbol'],
        'type': json['type'],
        'price': json['price'],
        'ethPrice': json['ethPrice'],
        'duration': !exists(json, 'duration') ? undefined : json['duration'],
        'totalSupply': json['totalSupply'],
        'remainingSupply': json['remainingSupply'],
        'chain': json['chain'],
        'freetrial': json['freetrial'],
        'collectionAddress': json['collectionAddress'],
        'pinnedAt': !exists(json, 'pinnedAt') ? undefined : (json['pinnedAt'] === null ? null : new Date(json['pinnedAt'])),
        'createdAt': (new Date(json['createdAt'])),
        'creatorUsername': !exists(json, 'creatorUsername') ? undefined : json['creatorUsername'],
        'creatorDisplayName': !exists(json, 'creatorDisplayName') ? undefined : json['creatorDisplayName'],
        'imageType': json['imageType'],
        'animationType': json['animationType'],
        'passHolderId': json['passHolderId'],
        'holderId': !exists(json, 'holderId') ? undefined : json['holderId'],
        'walletId': !exists(json, 'walletId') ? undefined : json['walletId'],
        'messages': !exists(json, 'messages') ? undefined : json['messages'],
        'expiresAt': !exists(json, 'expiresAt') ? undefined : (json['expiresAt'] === null ? null : new Date(json['expiresAt'])),
        'holderUsername': !exists(json, 'holderUsername') ? undefined : json['holderUsername'],
        'holderDisplayName': !exists(json, 'holderDisplayName') ? undefined : json['holderDisplayName'],
        'address': json['address'],
        'tokenId': !exists(json, 'tokenId') ? undefined : json['tokenId'],
    };
}

export function PassHolderDtoToJSON(value?: PassHolderDto | null): any {
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
        'symbol': value.symbol,
        'type': value.type,
        'price': value.price,
        'ethPrice': value.ethPrice,
        'duration': value.duration,
        'totalSupply': value.totalSupply,
        'remainingSupply': value.remainingSupply,
        'chain': value.chain,
        'freetrial': value.freetrial,
        'collectionAddress': value.collectionAddress,
        'pinnedAt': value.pinnedAt === undefined ? undefined : (value.pinnedAt === null ? null : value.pinnedAt.toISOString()),
        'createdAt': (value.createdAt.toISOString()),
        'creatorUsername': value.creatorUsername,
        'creatorDisplayName': value.creatorDisplayName,
        'imageType': value.imageType,
        'animationType': value.animationType,
        'passHolderId': value.passHolderId,
        'holderId': value.holderId,
        'walletId': value.walletId,
        'messages': value.messages,
        'expiresAt': value.expiresAt === undefined ? undefined : (value.expiresAt === null ? null : value.expiresAt.toISOString()),
        'holderUsername': value.holderUsername,
        'holderDisplayName': value.holderDisplayName,
        'address': value.address,
        'tokenId': value.tokenId,
    };
}


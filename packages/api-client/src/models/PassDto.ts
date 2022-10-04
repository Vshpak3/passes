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
 * @interface PassDto
 */
export interface PassDto {
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    passId: string;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    creatorId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    description: string;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    symbol: string;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    type: PassDtoTypeEnum;
    /**
     * 
     * @type {number}
     * @memberof PassDto
     */
    price: number;
    /**
     * 
     * @type {number}
     * @memberof PassDto
     */
    ethPrice: number | null;
    /**
     * 
     * @type {number}
     * @memberof PassDto
     */
    duration?: number | null;
    /**
     * 
     * @type {number}
     * @memberof PassDto
     */
    totalSupply: number;
    /**
     * 
     * @type {number}
     * @memberof PassDto
     */
    remainingSupply: number;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    chain: PassDtoChainEnum;
    /**
     * 
     * @type {boolean}
     * @memberof PassDto
     */
    freetrial: boolean;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    collectionAddress: string | null;
    /**
     * 
     * @type {Date}
     * @memberof PassDto
     */
    pinnedAt?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof PassDto
     */
    createdAt: Date;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    creatorUsername?: string;
    /**
     * 
     * @type {string}
     * @memberof PassDto
     */
    creatorDisplayName?: string;
}


/**
 * @export
 */
export const PassDtoTypeEnum = {
    Subscription: 'subscription',
    Lifetime: 'lifetime',
    External: 'external'
} as const;
export type PassDtoTypeEnum = typeof PassDtoTypeEnum[keyof typeof PassDtoTypeEnum];

/**
 * @export
 */
export const PassDtoChainEnum = {
    Eth: 'eth',
    Sol: 'sol',
    Avax: 'avax',
    Matic: 'matic'
} as const;
export type PassDtoChainEnum = typeof PassDtoChainEnum[keyof typeof PassDtoChainEnum];


/**
 * Check if a given object implements the PassDto interface.
 */
export function instanceOfPassDto(value: object): boolean {
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

    return isInstance;
}

export function PassDtoFromJSON(json: any): PassDto {
    return PassDtoFromJSONTyped(json, false);
}

export function PassDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PassDto {
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
    };
}

export function PassDtoToJSON(value?: PassDto | null): any {
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
    };
}


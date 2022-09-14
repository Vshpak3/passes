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
    creatorId?: string;
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
    duration?: number;
    /**
     * 
     * @type {number}
     * @memberof PassHolderDto
     */
    totalSupply: number;
    /**
     * 
     * @type {number}
     * @memberof PassHolderDto
     */
    remainingSupply: number;
    /**
     * 
     * @type {boolean}
     * @memberof PassHolderDto
     */
    freetrial: boolean;
    /**
     * 
     * @type {Date}
     * @memberof PassHolderDto
     */
    pinnedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof PassHolderDto
     */
    createdAt?: Date;
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
    passHolderId: string;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    holderId?: string;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    walletId?: string;
    /**
     * 
     * @type {object}
     * @memberof PassHolderDto
     */
    messages?: object;
    /**
     * 
     * @type {Date}
     * @memberof PassHolderDto
     */
    expiresAt?: Date;
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
    chain: PassHolderDtoChainEnum;
    /**
     * 
     * @type {string}
     * @memberof PassHolderDto
     */
    tokenId?: string;
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
 * Check if a given object implements the PassHolderDto interface.
 */
export function instanceOfPassHolderDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "passId" in value;
    isInstance = isInstance && "title" in value;
    isInstance = isInstance && "description" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "price" in value;
    isInstance = isInstance && "totalSupply" in value;
    isInstance = isInstance && "remainingSupply" in value;
    isInstance = isInstance && "freetrial" in value;
    isInstance = isInstance && "passHolderId" in value;
    isInstance = isInstance && "address" in value;
    isInstance = isInstance && "chain" in value;

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
        'passHolderId': json['passHolderId'],
        'holderId': !exists(json, 'holderId') ? undefined : json['holderId'],
        'walletId': !exists(json, 'walletId') ? undefined : json['walletId'],
        'messages': !exists(json, 'messages') ? undefined : json['messages'],
        'expiresAt': !exists(json, 'expiresAt') ? undefined : (new Date(json['expiresAt'])),
        'holderUsername': !exists(json, 'holderUsername') ? undefined : json['holderUsername'],
        'holderDisplayName': !exists(json, 'holderDisplayName') ? undefined : json['holderDisplayName'],
        'address': json['address'],
        'chain': json['chain'],
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
        'passHolderId': value.passHolderId,
        'holderId': value.holderId,
        'walletId': value.walletId,
        'messages': value.messages,
        'expiresAt': value.expiresAt === undefined ? undefined : (value.expiresAt.toISOString()),
        'holderUsername': value.holderUsername,
        'holderDisplayName': value.holderDisplayName,
        'address': value.address,
        'chain': value.chain,
        'tokenId': value.tokenId,
    };
}


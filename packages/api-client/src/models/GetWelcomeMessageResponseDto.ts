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
import type { ContentBareDto } from './ContentBareDto';
import {
    ContentBareDtoFromJSON,
    ContentBareDtoFromJSONTyped,
    ContentBareDtoToJSON,
} from './ContentBareDto';

/**
 * 
 * @export
 * @interface GetWelcomeMessageResponseDto
 */
export interface GetWelcomeMessageResponseDto {
    /**
     * 
     * @type {string}
     * @memberof GetWelcomeMessageResponseDto
     */
    paidMessageId: string;
    /**
     * 
     * @type {string}
     * @memberof GetWelcomeMessageResponseDto
     */
    creatorId: string;
    /**
     * 
     * @type {string}
     * @memberof GetWelcomeMessageResponseDto
     */
    text?: string;
    /**
     * 
     * @type {number}
     * @memberof GetWelcomeMessageResponseDto
     */
    price: number;
    /**
     * 
     * @type {Array<ContentBareDto>}
     * @memberof GetWelcomeMessageResponseDto
     */
    bareContents: Array<ContentBareDto>;
    /**
     * 
     * @type {number}
     * @memberof GetWelcomeMessageResponseDto
     */
    numPurchases: number;
    /**
     * 
     * @type {number}
     * @memberof GetWelcomeMessageResponseDto
     */
    earningsPurchases: number;
    /**
     * 
     * @type {Date}
     * @memberof GetWelcomeMessageResponseDto
     */
    createdAt: Date;
    /**
     * 
     * @type {boolean}
     * @memberof GetWelcomeMessageResponseDto
     */
    isWelcomeMesage: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof GetWelcomeMessageResponseDto
     */
    unsent: boolean;
    /**
     * 
     * @type {number}
     * @memberof GetWelcomeMessageResponseDto
     */
    sentTo: number;
}

/**
 * Check if a given object implements the GetWelcomeMessageResponseDto interface.
 */
export function instanceOfGetWelcomeMessageResponseDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "paidMessageId" in value;
    isInstance = isInstance && "creatorId" in value;
    isInstance = isInstance && "price" in value;
    isInstance = isInstance && "bareContents" in value;
    isInstance = isInstance && "numPurchases" in value;
    isInstance = isInstance && "earningsPurchases" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "isWelcomeMesage" in value;
    isInstance = isInstance && "unsent" in value;
    isInstance = isInstance && "sentTo" in value;

    return isInstance;
}

export function GetWelcomeMessageResponseDtoFromJSON(json: any): GetWelcomeMessageResponseDto {
    return GetWelcomeMessageResponseDtoFromJSONTyped(json, false);
}

export function GetWelcomeMessageResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetWelcomeMessageResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'paidMessageId': json['paidMessageId'],
        'creatorId': json['creatorId'],
        'text': !exists(json, 'text') ? undefined : json['text'],
        'price': json['price'],
        'bareContents': ((json['bareContents'] as Array<any>).map(ContentBareDtoFromJSON)),
        'numPurchases': json['numPurchases'],
        'earningsPurchases': json['earningsPurchases'],
        'createdAt': (new Date(json['createdAt'])),
        'isWelcomeMesage': json['isWelcomeMesage'],
        'unsent': json['unsent'],
        'sentTo': json['sentTo'],
    };
}

export function GetWelcomeMessageResponseDtoToJSON(value?: GetWelcomeMessageResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'paidMessageId': value.paidMessageId,
        'creatorId': value.creatorId,
        'text': value.text,
        'price': value.price,
        'bareContents': ((value.bareContents as Array<any>).map(ContentBareDtoToJSON)),
        'numPurchases': value.numPurchases,
        'earningsPurchases': value.earningsPurchases,
        'createdAt': (value.createdAt.toISOString()),
        'isWelcomeMesage': value.isWelcomeMesage,
        'unsent': value.unsent,
        'sentTo': value.sentTo,
    };
}


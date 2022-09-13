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
 * @interface CreatorEarningDto
 */
export interface CreatorEarningDto {
    /**
     * 
     * @type {string}
     * @memberof CreatorEarningDto
     */
    userId: string;
    /**
     * 
     * @type {number}
     * @memberof CreatorEarningDto
     */
    amount: number;
    /**
     * 
     * @type {string}
     * @memberof CreatorEarningDto
     */
    type: CreatorEarningDtoTypeEnum;
    /**
     * 
     * @type {Date}
     * @memberof CreatorEarningDto
     */
    createdAt: Date;
}


/**
 * @export
 */
export const CreatorEarningDtoTypeEnum = {
    Balance: 'balance',
    Total: 'total',
    Subscription: 'subscription',
    Tips: 'tips',
    Posts: 'posts',
    Messages: 'messages',
    Lifetime: 'lifetime',
    Other: 'other'
} as const;
export type CreatorEarningDtoTypeEnum = typeof CreatorEarningDtoTypeEnum[keyof typeof CreatorEarningDtoTypeEnum];


/**
 * Check if a given object implements the CreatorEarningDto interface.
 */
export function instanceOfCreatorEarningDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "amount" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "createdAt" in value;

    return isInstance;
}

export function CreatorEarningDtoFromJSON(json: any): CreatorEarningDto {
    return CreatorEarningDtoFromJSONTyped(json, false);
}

export function CreatorEarningDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreatorEarningDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'userId': json['userId'],
        'amount': json['amount'],
        'type': json['type'],
        'createdAt': (new Date(json['createdAt'])),
    };
}

export function CreatorEarningDtoToJSON(value?: CreatorEarningDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'userId': value.userId,
        'amount': value.amount,
        'type': value.type,
        'createdAt': (value.createdAt.toISOString()),
    };
}


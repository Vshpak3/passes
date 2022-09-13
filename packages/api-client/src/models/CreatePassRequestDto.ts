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
 * @interface CreatePassRequestDto
 */
export interface CreatePassRequestDto {
    /**
     * 
     * @type {string}
     * @memberof CreatePassRequestDto
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof CreatePassRequestDto
     */
    description: string;
    /**
     * 
     * @type {string}
     * @memberof CreatePassRequestDto
     */
    type: string;
    /**
     * 
     * @type {number}
     * @memberof CreatePassRequestDto
     */
    price: number;
    /**
     * 
     * @type {number}
     * @memberof CreatePassRequestDto
     */
    totalSupply: number;
    /**
     * 
     * @type {number}
     * @memberof CreatePassRequestDto
     */
    duration?: number;
    /**
     * 
     * @type {boolean}
     * @memberof CreatePassRequestDto
     */
    freetrial?: boolean;
    /**
     * 
     * @type {object}
     * @memberof CreatePassRequestDto
     */
    messages?: object;
    /**
     * 
     * @type {string}
     * @memberof CreatePassRequestDto
     */
    chain: CreatePassRequestDtoChainEnum;
}


/**
 * @export
 */
export const CreatePassRequestDtoChainEnum = {
    Eth: 'eth',
    Sol: 'sol',
    Avax: 'avax',
    Matic: 'matic'
} as const;
export type CreatePassRequestDtoChainEnum = typeof CreatePassRequestDtoChainEnum[keyof typeof CreatePassRequestDtoChainEnum];


/**
 * Check if a given object implements the CreatePassRequestDto interface.
 */
export function instanceOfCreatePassRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "title" in value;
    isInstance = isInstance && "description" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "price" in value;
    isInstance = isInstance && "totalSupply" in value;
    isInstance = isInstance && "chain" in value;

    return isInstance;
}

export function CreatePassRequestDtoFromJSON(json: any): CreatePassRequestDto {
    return CreatePassRequestDtoFromJSONTyped(json, false);
}

export function CreatePassRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreatePassRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'title': json['title'],
        'description': json['description'],
        'type': json['type'],
        'price': json['price'],
        'totalSupply': json['totalSupply'],
        'duration': !exists(json, 'duration') ? undefined : json['duration'],
        'freetrial': !exists(json, 'freetrial') ? undefined : json['freetrial'],
        'messages': !exists(json, 'messages') ? undefined : json['messages'],
        'chain': json['chain'],
    };
}

export function CreatePassRequestDtoToJSON(value?: CreatePassRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'title': value.title,
        'description': value.description,
        'type': value.type,
        'price': value.price,
        'totalSupply': value.totalSupply,
        'duration': value.duration,
        'freetrial': value.freetrial,
        'messages': value.messages,
        'chain': value.chain,
    };
}


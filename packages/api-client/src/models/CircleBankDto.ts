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
 * @interface CircleBankDto
 */
export interface CircleBankDto {
    /**
     * 
     * @type {string}
     * @memberof CircleBankDto
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof CircleBankDto
     */
    circleId?: string;
    /**
     * 
     * @type {string}
     * @memberof CircleBankDto
     */
    status: CircleBankDtoStatusEnum;
    /**
     * 
     * @type {string}
     * @memberof CircleBankDto
     */
    description: string;
    /**
     * 
     * @type {string}
     * @memberof CircleBankDto
     */
    country: string;
}


/**
 * @export
 */
export const CircleBankDtoStatusEnum = {
    Pending: 'pending',
    Complete: 'complete',
    Failed: 'failed'
} as const;
export type CircleBankDtoStatusEnum = typeof CircleBankDtoStatusEnum[keyof typeof CircleBankDtoStatusEnum];


/**
 * Check if a given object implements the CircleBankDto interface.
 */
export function instanceOfCircleBankDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "status" in value;
    isInstance = isInstance && "description" in value;
    isInstance = isInstance && "country" in value;

    return isInstance;
}

export function CircleBankDtoFromJSON(json: any): CircleBankDto {
    return CircleBankDtoFromJSONTyped(json, false);
}

export function CircleBankDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CircleBankDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'circleId': !exists(json, 'circleId') ? undefined : json['circleId'],
        'status': json['status'],
        'description': json['description'],
        'country': json['country'],
    };
}

export function CircleBankDtoToJSON(value?: CircleBankDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'circleId': value.circleId,
        'status': value.status,
        'description': value.description,
        'country': value.country,
    };
}


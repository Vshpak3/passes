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
import type { PayinMethodDto } from './PayinMethodDto';
import {
    PayinMethodDtoFromJSON,
    PayinMethodDtoFromJSONTyped,
    PayinMethodDtoToJSON,
} from './PayinMethodDto';

/**
 * 
 * @export
 * @interface CreatePassHolderRequestDto
 */
export interface CreatePassHolderRequestDto {
    /**
     * 
     * @type {string}
     * @memberof CreatePassHolderRequestDto
     */
    passId: string;
    /**
     * 
     * @type {PayinMethodDto}
     * @memberof CreatePassHolderRequestDto
     */
    payinMethod?: PayinMethodDto;
}

/**
 * Check if a given object implements the CreatePassHolderRequestDto interface.
 */
export function instanceOfCreatePassHolderRequestDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "passId" in value;

    return isInstance;
}

export function CreatePassHolderRequestDtoFromJSON(json: any): CreatePassHolderRequestDto {
    return CreatePassHolderRequestDtoFromJSONTyped(json, false);
}

export function CreatePassHolderRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreatePassHolderRequestDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'passId': json['passId'],
        'payinMethod': !exists(json, 'payinMethod') ? undefined : PayinMethodDtoFromJSON(json['payinMethod']),
    };
}

export function CreatePassHolderRequestDtoToJSON(value?: CreatePassHolderRequestDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'passId': value.passId,
        'payinMethod': PayinMethodDtoToJSON(value.payinMethod),
    };
}


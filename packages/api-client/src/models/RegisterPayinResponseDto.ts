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
import {
    PayinMethodDto,
    PayinMethodDtoFromJSON,
    PayinMethodDtoFromJSONTyped,
    PayinMethodDtoToJSON,
} from './PayinMethodDto';

/**
 * 
 * @export
 * @interface RegisterPayinResponseDto
 */
export interface RegisterPayinResponseDto {
    /**
     * 
     * @type {string}
     * @memberof RegisterPayinResponseDto
     */
    payinId: string;
    /**
     * 
     * @type {PayinMethodDto}
     * @memberof RegisterPayinResponseDto
     */
    payinMethod: PayinMethodDto;
    /**
     * 
     * @type {number}
     * @memberof RegisterPayinResponseDto
     */
    amount: number;
}

export function RegisterPayinResponseDtoFromJSON(json: any): RegisterPayinResponseDto {
    return RegisterPayinResponseDtoFromJSONTyped(json, false);
}

export function RegisterPayinResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): RegisterPayinResponseDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'payinId': json['payinId'],
        'payinMethod': PayinMethodDtoFromJSON(json['payinMethod']),
        'amount': json['amount'],
    };
}

export function RegisterPayinResponseDtoToJSON(value?: RegisterPayinResponseDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'payinId': value.payinId,
        'payinMethod': PayinMethodDtoToJSON(value.payinMethod),
        'amount': value.amount,
    };
}


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
    GetPassDto,
    GetPassDtoFromJSON,
    GetPassDtoFromJSONTyped,
    GetPassDtoToJSON,
} from './GetPassDto';
import {
    GetPassOwnershipDto,
    GetPassOwnershipDtoFromJSON,
    GetPassOwnershipDtoFromJSONTyped,
    GetPassOwnershipDtoToJSON,
} from './GetPassOwnershipDto';

/**
 * 
 * @export
 * @interface PayinTargetDto
 */
export interface PayinTargetDto {
    /**
     * 
     * @type {string}
     * @memberof PayinTargetDto
     */
    target: string;
    /**
     * 
     * @type {string}
     * @memberof PayinTargetDto
     */
    passId: string;
    /**
     * 
     * @type {string}
     * @memberof PayinTargetDto
     */
    passOwnershipId: string;
    /**
     * 
     * @type {GetPassDto}
     * @memberof PayinTargetDto
     */
    pass: GetPassDto;
    /**
     * 
     * @type {GetPassOwnershipDto}
     * @memberof PayinTargetDto
     */
    passOwnership: GetPassOwnershipDto;
}

export function PayinTargetDtoFromJSON(json: any): PayinTargetDto {
    return PayinTargetDtoFromJSONTyped(json, false);
}

export function PayinTargetDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PayinTargetDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'target': json['target'],
        'passId': json['passId'],
        'passOwnershipId': json['passOwnershipId'],
        'pass': GetPassDtoFromJSON(json['pass']),
        'passOwnership': GetPassOwnershipDtoFromJSON(json['passOwnership']),
    };
}

export function PayinTargetDtoToJSON(value?: PayinTargetDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'target': value.target,
        'passId': value.passId,
        'passOwnershipId': value.passOwnershipId,
        'pass': GetPassDtoToJSON(value.pass),
        'passOwnership': GetPassOwnershipDtoToJSON(value.passOwnership),
    };
}


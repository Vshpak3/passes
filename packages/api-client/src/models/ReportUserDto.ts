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
 * @interface ReportUserDto
 */
export interface ReportUserDto {
    /**
     * 
     * @type {string}
     * @memberof ReportUserDto
     */
    reason: string;
    /**
     * 
     * @type {string}
     * @memberof ReportUserDto
     */
    userId: string;
}

/**
 * Check if a given object implements the ReportUserDto interface.
 */
export function instanceOfReportUserDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "reason" in value;
    isInstance = isInstance && "userId" in value;

    return isInstance;
}

export function ReportUserDtoFromJSON(json: any): ReportUserDto {
    return ReportUserDtoFromJSONTyped(json, false);
}

export function ReportUserDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ReportUserDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'reason': json['reason'],
        'userId': json['userId'],
    };
}

export function ReportUserDtoToJSON(value?: ReportUserDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'reason': value.reason,
        'userId': value.userId,
    };
}


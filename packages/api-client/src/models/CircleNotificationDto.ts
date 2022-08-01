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
    PaymentDto,
    PaymentDtoFromJSON,
    PaymentDtoFromJSONTyped,
    PaymentDtoToJSON,
} from './PaymentDto';

/**
 * 
 * @export
 * @interface CircleNotificationDto
 */
export interface CircleNotificationDto {
    /**
     * 
     * @type {string}
     * @memberof CircleNotificationDto
     */
    clientId: string;
    /**
     * 
     * @type {string}
     * @memberof CircleNotificationDto
     */
    notificationType: string;
    /**
     * 
     * @type {number}
     * @memberof CircleNotificationDto
     */
    version: number;
    /**
     * 
     * @type {PaymentDto}
     * @memberof CircleNotificationDto
     */
    payment?: PaymentDto;
    /**
     * 
     * @type {object}
     * @memberof CircleNotificationDto
     */
    reversal?: object;
    /**
     * 
     * @type {object}
     * @memberof CircleNotificationDto
     */
    chargeback?: object;
    /**
     * 
     * @type {object}
     * @memberof CircleNotificationDto
     */
    payout?: object;
    /**
     * 
     * @type {object}
     * @memberof CircleNotificationDto
     */
    _return?: object;
    /**
     * 
     * @type {object}
     * @memberof CircleNotificationDto
     */
    settlement?: object;
    /**
     * 
     * @type {object}
     * @memberof CircleNotificationDto
     */
    card?: object;
    /**
     * 
     * @type {object}
     * @memberof CircleNotificationDto
     */
    ach?: object;
    /**
     * 
     * @type {object}
     * @memberof CircleNotificationDto
     */
    wire?: object;
    /**
     * 
     * @type {object}
     * @memberof CircleNotificationDto
     */
    transfer?: object;
}

export function CircleNotificationDtoFromJSON(json: any): CircleNotificationDto {
    return CircleNotificationDtoFromJSONTyped(json, false);
}

export function CircleNotificationDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CircleNotificationDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'clientId': json['clientId'],
        'notificationType': json['notificationType'],
        'version': json['version'],
        'payment': !exists(json, 'payment') ? undefined : PaymentDtoFromJSON(json['payment']),
        'reversal': !exists(json, 'reversal') ? undefined : json['reversal'],
        'chargeback': !exists(json, 'chargeback') ? undefined : json['chargeback'],
        'payout': !exists(json, 'payout') ? undefined : json['payout'],
        '_return': !exists(json, 'return') ? undefined : json['return'],
        'settlement': !exists(json, 'settlement') ? undefined : json['settlement'],
        'card': !exists(json, 'card') ? undefined : json['card'],
        'ach': !exists(json, 'ach') ? undefined : json['ach'],
        'wire': !exists(json, 'wire') ? undefined : json['wire'],
        'transfer': !exists(json, 'transfer') ? undefined : json['transfer'],
    };
}

export function CircleNotificationDtoToJSON(value?: CircleNotificationDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'clientId': value.clientId,
        'notificationType': value.notificationType,
        'version': value.version,
        'payment': PaymentDtoToJSON(value.payment),
        'reversal': value.reversal,
        'chargeback': value.chargeback,
        'payout': value.payout,
        'return': value._return,
        'settlement': value.settlement,
        'card': value.card,
        'ach': value.ach,
        'wire': value.wire,
        'transfer': value.transfer,
    };
}


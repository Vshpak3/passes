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


import * as runtime from '../runtime';
import {
    CardEntityDto,
    CardEntityDtoFromJSON,
    CardEntityDtoToJSON,
    CircleNotificationDto,
    CircleNotificationDtoFromJSON,
    CircleNotificationDtoToJSON,
    CreateAddressDto,
    CreateAddressDtoFromJSON,
    CreateAddressDtoToJSON,
    CreateBankDto,
    CreateBankDtoFromJSON,
    CreateBankDtoToJSON,
    CreateCardAndExtraDto,
    CreateCardAndExtraDtoFromJSON,
    CreateCardAndExtraDtoToJSON,
    CreateCardPaymentDto,
    CreateCardPaymentDtoFromJSON,
    CreateCardPaymentDtoToJSON,
    DefaultProviderDto,
    DefaultProviderDtoFromJSON,
    DefaultProviderDtoToJSON,
    EncryptionKeyDto,
    EncryptionKeyDtoFromJSON,
    EncryptionKeyDtoToJSON,
    StatusDto,
    StatusDtoFromJSON,
    StatusDtoToJSON,
} from '../models';

export interface PaymentCheckCircleCardStatusRequest {
    id: string;
}

export interface PaymentCheckCirclePaymentStatusRequest {
    id: string;
}

export interface PaymentCheckWireBankStatusRequest {
    id: string;
}

export interface PaymentCreateCircleCardRequest {
    createCardAndExtraDto: CreateCardAndExtraDto;
}

export interface PaymentCreateCircleWireBankAccountRequest {
    createBankDto: CreateBankDto;
}

export interface PaymentDeleteCircleCardRequest {
    circleCardId: string;
}

export interface PaymentGetCircleAddressRequest {
    createAddressDto: CreateAddressDto;
}

export interface PaymentRecieveNotificationsRequest {
    circleNotificationDto: CircleNotificationDto;
}

export interface PaymentSetDefaultPayinRequest {
    defaultProviderDto: DefaultProviderDto;
}

export interface PaymentUpdateRequest {
    createCardPaymentDto: CreateCardPaymentDto;
}

/**
 * 
 */
export class PaymentApi extends runtime.BaseAPI {

    /**
     * Check card status
     */
    async paymentCheckCircleCardStatusRaw(requestParameters: PaymentCheckCircleCardStatusRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<StatusDto>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling paymentCheckCircleCardStatus.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/card/status/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StatusDtoFromJSON(jsonValue));
    }

    /**
     * Check card status
     */
    async paymentCheckCircleCardStatus(requestParameters: PaymentCheckCircleCardStatusRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<StatusDto> {
        const response = await this.paymentCheckCircleCardStatusRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Check payment status
     */
    async paymentCheckCirclePaymentStatusRaw(requestParameters: PaymentCheckCirclePaymentStatusRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<StatusDto>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling paymentCheckCirclePaymentStatus.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/status/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StatusDtoFromJSON(jsonValue));
    }

    /**
     * Check payment status
     */
    async paymentCheckCirclePaymentStatus(requestParameters: PaymentCheckCirclePaymentStatusRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<StatusDto> {
        const response = await this.paymentCheckCirclePaymentStatusRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Check wire bank status
     */
    async paymentCheckWireBankStatusRaw(requestParameters: PaymentCheckWireBankStatusRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<StatusDto>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling paymentCheckWireBankStatus.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/bank/wire/status/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StatusDtoFromJSON(jsonValue));
    }

    /**
     * Check wire bank status
     */
    async paymentCheckWireBankStatus(requestParameters: PaymentCheckWireBankStatusRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<StatusDto> {
        const response = await this.paymentCheckWireBankStatusRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates a card
     */
    async paymentCreateCircleCardRaw(requestParameters: PaymentCreateCircleCardRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<StatusDto>> {
        if (requestParameters.createCardAndExtraDto === null || requestParameters.createCardAndExtraDto === undefined) {
            throw new runtime.RequiredError('createCardAndExtraDto','Required parameter requestParameters.createCardAndExtraDto was null or undefined when calling paymentCreateCircleCard.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/card/create`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateCardAndExtraDtoToJSON(requestParameters.createCardAndExtraDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StatusDtoFromJSON(jsonValue));
    }

    /**
     * Creates a card
     */
    async paymentCreateCircleCard(requestParameters: PaymentCreateCircleCardRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<StatusDto> {
        const response = await this.paymentCreateCircleCardRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Create wire bank account
     */
    async paymentCreateCircleWireBankAccountRaw(requestParameters: PaymentCreateCircleWireBankAccountRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<StatusDto>> {
        if (requestParameters.createBankDto === null || requestParameters.createBankDto === undefined) {
            throw new runtime.RequiredError('createBankDto','Required parameter requestParameters.createBankDto was null or undefined when calling paymentCreateCircleWireBankAccount.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/bank/wire/create`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateBankDtoToJSON(requestParameters.createBankDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StatusDtoFromJSON(jsonValue));
    }

    /**
     * Create wire bank account
     */
    async paymentCreateCircleWireBankAccount(requestParameters: PaymentCreateCircleWireBankAccountRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<StatusDto> {
        const response = await this.paymentCreateCircleWireBankAccountRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Deletes a card
     */
    async paymentDeleteCircleCardRaw(requestParameters: PaymentDeleteCircleCardRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.circleCardId === null || requestParameters.circleCardId === undefined) {
            throw new runtime.RequiredError('circleCardId','Required parameter requestParameters.circleCardId was null or undefined when calling paymentDeleteCircleCard.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/card/delete/{circleCardId}`.replace(`{${"circleCardId"}}`, encodeURIComponent(String(requestParameters.circleCardId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Deletes a card
     */
    async paymentDeleteCircleCard(requestParameters: PaymentDeleteCircleCardRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<boolean> {
        const response = await this.paymentDeleteCircleCardRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get crypto address
     */
    async paymentGetCircleAddressRaw(requestParameters: PaymentGetCircleAddressRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters.createAddressDto === null || requestParameters.createAddressDto === undefined) {
            throw new runtime.RequiredError('createAddressDto','Required parameter requestParameters.createAddressDto was null or undefined when calling paymentGetCircleAddress.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/address`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
            body: CreateAddressDtoToJSON(requestParameters.createAddressDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Get crypto address
     */
    async paymentGetCircleAddress(requestParameters: PaymentGetCircleAddressRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<string> {
        const response = await this.paymentGetCircleAddressRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get cards
     */
    async paymentGetCircleCardsRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<Array<CardEntityDto>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/cards`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(CardEntityDtoFromJSON));
    }

    /**
     * Get cards
     */
    async paymentGetCircleCards(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<Array<CardEntityDto>> {
        const response = await this.paymentGetCircleCardsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get circle encryption key
     */
    async paymentGetCircleEncryptionKeyRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<EncryptionKeyDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/key`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => EncryptionKeyDtoFromJSON(jsonValue));
    }

    /**
     * Get circle encryption key
     */
    async paymentGetCircleEncryptionKey(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<EncryptionKeyDto> {
        const response = await this.paymentGetCircleEncryptionKeyRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get default payin
     */
    async paymentGetDefaultPayinRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<DefaultProviderDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/payin/default`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DefaultProviderDtoFromJSON(jsonValue));
    }

    /**
     * Get default payin
     */
    async paymentGetDefaultPayin(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<DefaultProviderDto> {
        const response = await this.paymentGetDefaultPayinRaw(initOverrides);
        return await response.value();
    }

    /**
     * Circle notifications
     */
    async paymentRecieveNotificationsRaw(requestParameters: PaymentRecieveNotificationsRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.circleNotificationDto === null || requestParameters.circleNotificationDto === undefined) {
            throw new runtime.RequiredError('circleNotificationDto','Required parameter requestParameters.circleNotificationDto was null or undefined when calling paymentRecieveNotifications.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/circle/notification`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CircleNotificationDtoToJSON(requestParameters.circleNotificationDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Circle notifications
     */
    async paymentRecieveNotifications(requestParameters: PaymentRecieveNotificationsRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.paymentRecieveNotificationsRaw(requestParameters, initOverrides);
    }

    /**
     * Circle notifications register
     */
    async paymentRegisterNotificationsRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<boolean>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/circle/notification`,
            method: 'HEAD',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Circle notifications register
     */
    async paymentRegisterNotifications(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<boolean> {
        const response = await this.paymentRegisterNotificationsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Set default payin
     */
    async paymentSetDefaultPayinRaw(requestParameters: PaymentSetDefaultPayinRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.defaultProviderDto === null || requestParameters.defaultProviderDto === undefined) {
            throw new runtime.RequiredError('defaultProviderDto','Required parameter requestParameters.defaultProviderDto was null or undefined when calling paymentSetDefaultPayin.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/payin/default`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DefaultProviderDtoToJSON(requestParameters.defaultProviderDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Set default payin
     */
    async paymentSetDefaultPayin(requestParameters: PaymentSetDefaultPayinRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<boolean> {
        const response = await this.paymentSetDefaultPayinRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Make card payment
     */
    async paymentUpdateRaw(requestParameters: PaymentUpdateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<StatusDto>> {
        if (requestParameters.createCardPaymentDto === null || requestParameters.createCardPaymentDto === undefined) {
            throw new runtime.RequiredError('createCardPaymentDto','Required parameter requestParameters.createCardPaymentDto was null or undefined when calling paymentUpdate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/pay`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateCardPaymentDtoToJSON(requestParameters.createCardPaymentDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StatusDtoFromJSON(jsonValue));
    }

    /**
     * Make card payment
     */
    async paymentUpdate(requestParameters: PaymentUpdateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<StatusDto> {
        const response = await this.paymentUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

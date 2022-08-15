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
    CircleBankDto,
    CircleBankDtoFromJSON,
    CircleBankDtoToJSON,
    CircleCardDto,
    CircleCardDtoFromJSON,
    CircleCardDtoToJSON,
    CircleCardPayinEntryRequestDto,
    CircleCardPayinEntryRequestDtoFromJSON,
    CircleCardPayinEntryRequestDtoToJSON,
    CircleCardPayinEntryResponseDto,
    CircleCardPayinEntryResponseDtoFromJSON,
    CircleCardPayinEntryResponseDtoToJSON,
    CircleCreateBankDto,
    CircleCreateBankDtoFromJSON,
    CircleCreateBankDtoToJSON,
    CircleCreateCardAndExtraDto,
    CircleCreateCardAndExtraDtoFromJSON,
    CircleCreateCardAndExtraDtoToJSON,
    CircleEncryptionKeyDto,
    CircleEncryptionKeyDtoFromJSON,
    CircleEncryptionKeyDtoToJSON,
    CircleStatusDto,
    CircleStatusDtoFromJSON,
    CircleStatusDtoToJSON,
    MetamaskCircleETHEntryRequestDto,
    MetamaskCircleETHEntryRequestDtoFromJSON,
    MetamaskCircleETHEntryRequestDtoToJSON,
    MetamaskCircleETHEntryResponseDto,
    MetamaskCircleETHEntryResponseDtoFromJSON,
    MetamaskCircleETHEntryResponseDtoToJSON,
    MetamaskCircleUSDCEntryRequestDto,
    MetamaskCircleUSDCEntryRequestDtoFromJSON,
    MetamaskCircleUSDCEntryRequestDtoToJSON,
    MetamaskCircleUSDCEntryResponseDto,
    MetamaskCircleUSDCEntryResponseDtoFromJSON,
    MetamaskCircleUSDCEntryResponseDtoToJSON,
    PayinListRequestDto,
    PayinListRequestDtoFromJSON,
    PayinListRequestDtoToJSON,
    PayinListResponseDto,
    PayinListResponseDtoFromJSON,
    PayinListResponseDtoToJSON,
    PayinMethodDto,
    PayinMethodDtoFromJSON,
    PayinMethodDtoToJSON,
    PayoutMethodDto,
    PayoutMethodDtoFromJSON,
    PayoutMethodDtoToJSON,
    PhantomCircleUSDCEntryRequestDto,
    PhantomCircleUSDCEntryRequestDtoFromJSON,
    PhantomCircleUSDCEntryRequestDtoToJSON,
    PhantomCircleUSDCEntryResponseDto,
    PhantomCircleUSDCEntryResponseDtoFromJSON,
    PhantomCircleUSDCEntryResponseDtoToJSON,
    RegisterPayinResponseDto,
    RegisterPayinResponseDtoFromJSON,
    RegisterPayinResponseDtoToJSON,
} from '../models';

export interface PaymentCancelPayinRequest {
    payinId: string;
}

export interface PaymentCreateCircleBankRequest {
    circleCreateBankDto: CircleCreateBankDto;
}

export interface PaymentCreateCircleCardRequest {
    circleCreateCardAndExtraDto: CircleCreateCardAndExtraDto;
}

export interface PaymentDeleteCircleBankRequest {
    circleBankId: string;
}

export interface PaymentDeleteCircleCardRequest {
    circleCardId: string;
}

export interface PaymentEntryCircleCardRequest {
    circleCardPayinEntryRequestDto: CircleCardPayinEntryRequestDto;
}

export interface PaymentEntryMetamaskCircleETHRequest {
    metamaskCircleETHEntryRequestDto: MetamaskCircleETHEntryRequestDto;
}

export interface PaymentEntryMetamaskCircleUSDCRequest {
    metamaskCircleUSDCEntryRequestDto: MetamaskCircleUSDCEntryRequestDto;
}

export interface PaymentEntryPhantomCircleUSDCRequest {
    phantomCircleUSDCEntryRequestDto: PhantomCircleUSDCEntryRequestDto;
}

export interface PaymentGetPayinsRequest {
    payinListRequestDto: PayinListRequestDto;
}

export interface PaymentRePayoutRequest {
    payoutId: string;
}

export interface PaymentRecieveNotificationsRequest {
    body: string;
}

export interface PaymentSetDefaultPayinMethodRequest {
    payinMethodDto: PayinMethodDto;
}

export interface PaymentSetDefaultPayoutMethodRequest {
    payoutMethodDto: PayoutMethodDto;
}

/**
 * 
 */
export class PaymentApi extends runtime.BaseAPI {

    /**
     * Cancel a payin
     */
    async paymentCancelPayinRaw(requestParameters: PaymentCancelPayinRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.payinId === null || requestParameters.payinId === undefined) {
            throw new runtime.RequiredError('payinId','Required parameter requestParameters.payinId was null or undefined when calling paymentCancelPayin.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/payin/cancel/{payinId}`.replace(`{${"payinId"}}`, encodeURIComponent(String(requestParameters.payinId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Cancel a payin
     */
    async paymentCancelPayin(requestParameters: PaymentCancelPayinRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.paymentCancelPayinRaw(requestParameters, initOverrides);
    }

    /**
     * Create a wire bank account
     */
    async paymentCreateCircleBankRaw(requestParameters: PaymentCreateCircleBankRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<CircleStatusDto>> {
        if (requestParameters.circleCreateBankDto === null || requestParameters.circleCreateBankDto === undefined) {
            throw new runtime.RequiredError('circleCreateBankDto','Required parameter requestParameters.circleCreateBankDto was null or undefined when calling paymentCreateCircleBank.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/bank/create`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CircleCreateBankDtoToJSON(requestParameters.circleCreateBankDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CircleStatusDtoFromJSON(jsonValue));
    }

    /**
     * Create a wire bank account
     */
    async paymentCreateCircleBank(requestParameters: PaymentCreateCircleBankRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<CircleStatusDto> {
        const response = await this.paymentCreateCircleBankRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates a card
     */
    async paymentCreateCircleCardRaw(requestParameters: PaymentCreateCircleCardRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<CircleStatusDto>> {
        if (requestParameters.circleCreateCardAndExtraDto === null || requestParameters.circleCreateCardAndExtraDto === undefined) {
            throw new runtime.RequiredError('circleCreateCardAndExtraDto','Required parameter requestParameters.circleCreateCardAndExtraDto was null or undefined when calling paymentCreateCircleCard.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/card/create`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CircleCreateCardAndExtraDtoToJSON(requestParameters.circleCreateCardAndExtraDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CircleStatusDtoFromJSON(jsonValue));
    }

    /**
     * Creates a card
     */
    async paymentCreateCircleCard(requestParameters: PaymentCreateCircleCardRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<CircleStatusDto> {
        const response = await this.paymentCreateCircleCardRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete a wire bank account
     */
    async paymentDeleteCircleBankRaw(requestParameters: PaymentDeleteCircleBankRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<CircleStatusDto>> {
        if (requestParameters.circleBankId === null || requestParameters.circleBankId === undefined) {
            throw new runtime.RequiredError('circleBankId','Required parameter requestParameters.circleBankId was null or undefined when calling paymentDeleteCircleBank.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/bank/delete/{circleBankId}`.replace(`{${"circleBankId"}}`, encodeURIComponent(String(requestParameters.circleBankId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CircleStatusDtoFromJSON(jsonValue));
    }

    /**
     * Delete a wire bank account
     */
    async paymentDeleteCircleBank(requestParameters: PaymentDeleteCircleBankRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<CircleStatusDto> {
        const response = await this.paymentDeleteCircleBankRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete a card
     */
    async paymentDeleteCircleCardRaw(requestParameters: PaymentDeleteCircleCardRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
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

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a card
     */
    async paymentDeleteCircleCard(requestParameters: PaymentDeleteCircleCardRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.paymentDeleteCircleCardRaw(requestParameters, initOverrides);
    }

    /**
     * Circlecard payin entrypoint
     */
    async paymentEntryCircleCardRaw(requestParameters: PaymentEntryCircleCardRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<CircleCardPayinEntryResponseDto>> {
        if (requestParameters.circleCardPayinEntryRequestDto === null || requestParameters.circleCardPayinEntryRequestDto === undefined) {
            throw new runtime.RequiredError('circleCardPayinEntryRequestDto','Required parameter requestParameters.circleCardPayinEntryRequestDto was null or undefined when calling paymentEntryCircleCard.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/payin/entry/circle-card`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CircleCardPayinEntryRequestDtoToJSON(requestParameters.circleCardPayinEntryRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CircleCardPayinEntryResponseDtoFromJSON(jsonValue));
    }

    /**
     * Circlecard payin entrypoint
     */
    async paymentEntryCircleCard(requestParameters: PaymentEntryCircleCardRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<CircleCardPayinEntryResponseDto> {
        const response = await this.paymentEntryCircleCardRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Metamask ETH payin entrypoint
     */
    async paymentEntryMetamaskCircleETHRaw(requestParameters: PaymentEntryMetamaskCircleETHRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<MetamaskCircleETHEntryResponseDto>> {
        if (requestParameters.metamaskCircleETHEntryRequestDto === null || requestParameters.metamaskCircleETHEntryRequestDto === undefined) {
            throw new runtime.RequiredError('metamaskCircleETHEntryRequestDto','Required parameter requestParameters.metamaskCircleETHEntryRequestDto was null or undefined when calling paymentEntryMetamaskCircleETH.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/payin/entry/metamask-eth`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: MetamaskCircleETHEntryRequestDtoToJSON(requestParameters.metamaskCircleETHEntryRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => MetamaskCircleETHEntryResponseDtoFromJSON(jsonValue));
    }

    /**
     * Metamask ETH payin entrypoint
     */
    async paymentEntryMetamaskCircleETH(requestParameters: PaymentEntryMetamaskCircleETHRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<MetamaskCircleETHEntryResponseDto> {
        const response = await this.paymentEntryMetamaskCircleETHRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Metamask USDC payin entrypoint
     */
    async paymentEntryMetamaskCircleUSDCRaw(requestParameters: PaymentEntryMetamaskCircleUSDCRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<MetamaskCircleUSDCEntryResponseDto>> {
        if (requestParameters.metamaskCircleUSDCEntryRequestDto === null || requestParameters.metamaskCircleUSDCEntryRequestDto === undefined) {
            throw new runtime.RequiredError('metamaskCircleUSDCEntryRequestDto','Required parameter requestParameters.metamaskCircleUSDCEntryRequestDto was null or undefined when calling paymentEntryMetamaskCircleUSDC.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/payin/entry/metamask-usdc`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: MetamaskCircleUSDCEntryRequestDtoToJSON(requestParameters.metamaskCircleUSDCEntryRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => MetamaskCircleUSDCEntryResponseDtoFromJSON(jsonValue));
    }

    /**
     * Metamask USDC payin entrypoint
     */
    async paymentEntryMetamaskCircleUSDC(requestParameters: PaymentEntryMetamaskCircleUSDCRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<MetamaskCircleUSDCEntryResponseDto> {
        const response = await this.paymentEntryMetamaskCircleUSDCRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Phantom USDC payin entrypoint
     */
    async paymentEntryPhantomCircleUSDCRaw(requestParameters: PaymentEntryPhantomCircleUSDCRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<PhantomCircleUSDCEntryResponseDto>> {
        if (requestParameters.phantomCircleUSDCEntryRequestDto === null || requestParameters.phantomCircleUSDCEntryRequestDto === undefined) {
            throw new runtime.RequiredError('phantomCircleUSDCEntryRequestDto','Required parameter requestParameters.phantomCircleUSDCEntryRequestDto was null or undefined when calling paymentEntryPhantomCircleUSDC.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/payin/entry/phantom-usdc`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PhantomCircleUSDCEntryRequestDtoToJSON(requestParameters.phantomCircleUSDCEntryRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PhantomCircleUSDCEntryResponseDtoFromJSON(jsonValue));
    }

    /**
     * Phantom USDC payin entrypoint
     */
    async paymentEntryPhantomCircleUSDC(requestParameters: PaymentEntryPhantomCircleUSDCRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<PhantomCircleUSDCEntryResponseDto> {
        const response = await this.paymentEntryPhantomCircleUSDCRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get wire bank acccounts
     */
    async paymentGetCircleBanksRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<Array<CircleBankDto>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/banks`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(CircleBankDtoFromJSON));
    }

    /**
     * Get wire bank acccounts
     */
    async paymentGetCircleBanks(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<Array<CircleBankDto>> {
        const response = await this.paymentGetCircleBanksRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get cards
     */
    async paymentGetCircleCardsRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<Array<CircleCardDto>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/cards`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(CircleCardDtoFromJSON));
    }

    /**
     * Get cards
     */
    async paymentGetCircleCards(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<Array<CircleCardDto>> {
        const response = await this.paymentGetCircleCardsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get circle encryption key
     */
    async paymentGetCircleEncryptionKeyRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<CircleEncryptionKeyDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/key`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CircleEncryptionKeyDtoFromJSON(jsonValue));
    }

    /**
     * Get circle encryption key
     */
    async paymentGetCircleEncryptionKey(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<CircleEncryptionKeyDto> {
        const response = await this.paymentGetCircleEncryptionKeyRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get default payin method
     */
    async paymentGetDefaultPayinMethodRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<PayinMethodDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/payin/default`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PayinMethodDtoFromJSON(jsonValue));
    }

    /**
     * Get default payin method
     */
    async paymentGetDefaultPayinMethod(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<PayinMethodDto> {
        const response = await this.paymentGetDefaultPayinMethodRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get default payout method
     */
    async paymentGetDefaultPayoutMethodRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<PayoutMethodDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/payout/default`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PayoutMethodDtoFromJSON(jsonValue));
    }

    /**
     * Get default payout method
     */
    async paymentGetDefaultPayoutMethod(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<PayoutMethodDto> {
        const response = await this.paymentGetDefaultPayoutMethodRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get all payins
     */
    async paymentGetPayinsRaw(requestParameters: PaymentGetPayinsRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<PayinListResponseDto>> {
        if (requestParameters.payinListRequestDto === null || requestParameters.payinListRequestDto === undefined) {
            throw new runtime.RequiredError('payinListRequestDto','Required parameter requestParameters.payinListRequestDto was null or undefined when calling paymentGetPayins.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/payin`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PayinListRequestDtoToJSON(requestParameters.payinListRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PayinListResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get all payins
     */
    async paymentGetPayins(requestParameters: PaymentGetPayinsRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<PayinListResponseDto> {
        const response = await this.paymentGetPayinsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Payout everyone
     */
    async paymentPayoutRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/test/payout`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Payout everyone
     */
    async paymentPayout(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.paymentPayoutRaw(initOverrides);
    }

    /**
     * Rerun payout
     */
    async paymentRePayoutRaw(requestParameters: PaymentRePayoutRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.payoutId === null || requestParameters.payoutId === undefined) {
            throw new runtime.RequiredError('payoutId','Required parameter requestParameters.payoutId was null or undefined when calling paymentRePayout.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/test/payout/{payoutId}`.replace(`{${"payoutId"}}`, encodeURIComponent(String(requestParameters.payoutId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Rerun payout
     */
    async paymentRePayout(requestParameters: PaymentRePayoutRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.paymentRePayoutRaw(requestParameters, initOverrides);
    }

    /**
     * Circle notifications
     */
    async paymentRecieveNotificationsRaw(requestParameters: PaymentRecieveNotificationsRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.body === null || requestParameters.body === undefined) {
            throw new runtime.RequiredError('body','Required parameter requestParameters.body was null or undefined when calling paymentRecieveNotifications.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/circle/notification`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
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
     * Register payin
     */
    async paymentRegisterPayinRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<RegisterPayinResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/payment/test/register/payin`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RegisterPayinResponseDtoFromJSON(jsonValue));
    }

    /**
     * Register payin
     */
    async paymentRegisterPayin(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<RegisterPayinResponseDto> {
        const response = await this.paymentRegisterPayinRaw(initOverrides);
        return await response.value();
    }

    /**
     * Set default payin method
     */
    async paymentSetDefaultPayinMethodRaw(requestParameters: PaymentSetDefaultPayinMethodRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.payinMethodDto === null || requestParameters.payinMethodDto === undefined) {
            throw new runtime.RequiredError('payinMethodDto','Required parameter requestParameters.payinMethodDto was null or undefined when calling paymentSetDefaultPayinMethod.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/payin/default`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PayinMethodDtoToJSON(requestParameters.payinMethodDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Set default payin method
     */
    async paymentSetDefaultPayinMethod(requestParameters: PaymentSetDefaultPayinMethodRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.paymentSetDefaultPayinMethodRaw(requestParameters, initOverrides);
    }

    /**
     * Set default payout method
     */
    async paymentSetDefaultPayoutMethodRaw(requestParameters: PaymentSetDefaultPayoutMethodRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.payoutMethodDto === null || requestParameters.payoutMethodDto === undefined) {
            throw new runtime.RequiredError('payoutMethodDto','Required parameter requestParameters.payoutMethodDto was null or undefined when calling paymentSetDefaultPayoutMethod.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/payment/payout/default`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PayoutMethodDtoToJSON(requestParameters.payoutMethodDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Set default payout method
     */
    async paymentSetDefaultPayoutMethod(requestParameters: PaymentSetDefaultPayoutMethodRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.paymentSetDefaultPayoutMethodRaw(requestParameters, initOverrides);
    }

}

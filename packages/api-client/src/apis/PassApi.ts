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
    CreatePassHolderRequestDto,
    CreatePassHolderRequestDtoFromJSON,
    CreatePassHolderRequestDtoToJSON,
    CreatePassRequestDto,
    CreatePassRequestDtoFromJSON,
    CreatePassRequestDtoToJSON,
    GetPassHoldersResponseDto,
    GetPassHoldersResponseDtoFromJSON,
    GetPassHoldersResponseDtoToJSON,
    GetPassResponseDto,
    GetPassResponseDtoFromJSON,
    GetPassResponseDtoToJSON,
    GetPassesResponseDto,
    GetPassesResponseDtoFromJSON,
    GetPassesResponseDtoToJSON,
    PayinDataDto,
    PayinDataDtoFromJSON,
    PayinDataDtoToJSON,
    RegisterPayinResponseDto,
    RegisterPayinResponseDtoFromJSON,
    RegisterPayinResponseDtoToJSON,
    RenewPassHolderRequestDto,
    RenewPassHolderRequestDtoFromJSON,
    RenewPassHolderRequestDtoToJSON,
    UpdatePassRequestDto,
    UpdatePassRequestDtoFromJSON,
    UpdatePassRequestDtoToJSON,
} from '../models';

export interface PassAddPassSubscriptionRequest {
    passHolderId: string;
}

export interface PassCreateRequest {
    createPassRequestDto: CreatePassRequestDto;
}

export interface PassFindOneRequest {
    id: string;
}

export interface PassGetCreatorPassesRequest {
    creatorId: string;
}

export interface PassGetOwnedPassesRequest {
    creatorId: string;
}

export interface PassGetPassHoldersRequest {
    passId: string;
}

export interface PassPinPostRequest {
    passId: string;
}

export interface PassRegisterCreatePassRequest {
    createPassHolderRequestDto: CreatePassHolderRequestDto;
}

export interface PassRegisterCreatePassDataRequest {
    createPassHolderRequestDto: CreatePassHolderRequestDto;
}

export interface PassRegisterRenewPassRequest {
    renewPassHolderRequestDto: RenewPassHolderRequestDto;
}

export interface PassRegisterRenewPassDataRequest {
    renewPassHolderRequestDto: RenewPassHolderRequestDto;
}

export interface PassUnpinPostRequest {
    passId: string;
}

export interface PassUpdateRequest {
    id: string;
    updatePassRequestDto: UpdatePassRequestDto;
}

/**
 * 
 */
export class PassApi extends runtime.BaseAPI {

    /**
     * Add pass subscription
     */
    async passAddPassSubscriptionRaw(requestParameters: PassAddPassSubscriptionRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.passHolderId === null || requestParameters.passHolderId === undefined) {
            throw new runtime.RequiredError('passHolderId','Required parameter requestParameters.passHolderId was null or undefined when calling passAddPassSubscription.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/pass/subscription/add/{passHolderId}`.replace(`{${"passHolderId"}}`, encodeURIComponent(String(requestParameters.passHolderId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Add pass subscription
     */
    async passAddPassSubscription(requestParameters: PassAddPassSubscriptionRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.passAddPassSubscriptionRaw(requestParameters, initOverrides);
    }

    /**
     * Creates a pass
     */
    async passCreateRaw(requestParameters: PassCreateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetPassResponseDto>> {
        if (requestParameters.createPassRequestDto === null || requestParameters.createPassRequestDto === undefined) {
            throw new runtime.RequiredError('createPassRequestDto','Required parameter requestParameters.createPassRequestDto was null or undefined when calling passCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/pass`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreatePassRequestDtoToJSON(requestParameters.createPassRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetPassResponseDtoFromJSON(jsonValue));
    }

    /**
     * Creates a pass
     */
    async passCreate(requestParameters: PassCreateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetPassResponseDto> {
        const response = await this.passCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets a pass
     */
    async passFindOneRaw(requestParameters: PassFindOneRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetPassResponseDto>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling passFindOne.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/pass/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetPassResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets a pass
     */
    async passFindOne(requestParameters: PassFindOneRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetPassResponseDto> {
        const response = await this.passFindOneRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets passes created by a creator
     */
    async passGetCreatorPassesRaw(requestParameters: PassGetCreatorPassesRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetPassesResponseDto>> {
        if (requestParameters.creatorId === null || requestParameters.creatorId === undefined) {
            throw new runtime.RequiredError('creatorId','Required parameter requestParameters.creatorId was null or undefined when calling passGetCreatorPasses.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/pass/created/{creatorId}`.replace(`{${"creatorId"}}`, encodeURIComponent(String(requestParameters.creatorId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetPassesResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets passes created by a creator
     */
    async passGetCreatorPasses(requestParameters: PassGetCreatorPassesRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetPassesResponseDto> {
        const response = await this.passGetCreatorPassesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets passes held by user
     */
    async passGetOwnedPassesRaw(requestParameters: PassGetOwnedPassesRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetPassesResponseDto>> {
        if (requestParameters.creatorId === null || requestParameters.creatorId === undefined) {
            throw new runtime.RequiredError('creatorId','Required parameter requestParameters.creatorId was null or undefined when calling passGetOwnedPasses.');
        }

        const queryParameters: any = {};

        if (requestParameters.creatorId !== undefined) {
            queryParameters['creatorId'] = requestParameters.creatorId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/pass/owned`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetPassesResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets passes held by user
     */
    async passGetOwnedPasses(requestParameters: PassGetOwnedPassesRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetPassesResponseDto> {
        const response = await this.passGetOwnedPassesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get a passholders
     */
    async passGetPassHoldersRaw(requestParameters: PassGetPassHoldersRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetPassHoldersResponseDto>> {
        if (requestParameters.passId === null || requestParameters.passId === undefined) {
            throw new runtime.RequiredError('passId','Required parameter requestParameters.passId was null or undefined when calling passGetPassHolders.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/pass/passholders/{passId}`.replace(`{${"passId"}}`, encodeURIComponent(String(requestParameters.passId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetPassHoldersResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get a passholders
     */
    async passGetPassHolders(requestParameters: PassGetPassHoldersRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetPassHoldersResponseDto> {
        const response = await this.passGetPassHoldersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Pin a pass
     */
    async passPinPostRaw(requestParameters: PassPinPostRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.passId === null || requestParameters.passId === undefined) {
            throw new runtime.RequiredError('passId','Required parameter requestParameters.passId was null or undefined when calling passPinPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/pass/pin/{passId}`.replace(`{${"passId"}}`, encodeURIComponent(String(requestParameters.passId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Pin a pass
     */
    async passPinPost(requestParameters: PassPinPostRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<boolean> {
        const response = await this.passPinPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Register create pass payin
     */
    async passRegisterCreatePassRaw(requestParameters: PassRegisterCreatePassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<RegisterPayinResponseDto>> {
        if (requestParameters.createPassHolderRequestDto === null || requestParameters.createPassHolderRequestDto === undefined) {
            throw new runtime.RequiredError('createPassHolderRequestDto','Required parameter requestParameters.createPassHolderRequestDto was null or undefined when calling passRegisterCreatePass.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/pass/pay/create`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreatePassHolderRequestDtoToJSON(requestParameters.createPassHolderRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RegisterPayinResponseDtoFromJSON(jsonValue));
    }

    /**
     * Register create pass payin
     */
    async passRegisterCreatePass(requestParameters: PassRegisterCreatePassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<RegisterPayinResponseDto> {
        const response = await this.passRegisterCreatePassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get register create pass data
     */
    async passRegisterCreatePassDataRaw(requestParameters: PassRegisterCreatePassDataRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<PayinDataDto>> {
        if (requestParameters.createPassHolderRequestDto === null || requestParameters.createPassHolderRequestDto === undefined) {
            throw new runtime.RequiredError('createPassHolderRequestDto','Required parameter requestParameters.createPassHolderRequestDto was null or undefined when calling passRegisterCreatePassData.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/pass/pay/data/create`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreatePassHolderRequestDtoToJSON(requestParameters.createPassHolderRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PayinDataDtoFromJSON(jsonValue));
    }

    /**
     * Get register create pass data
     */
    async passRegisterCreatePassData(requestParameters: PassRegisterCreatePassDataRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<PayinDataDto> {
        const response = await this.passRegisterCreatePassDataRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Register renew pass payin
     */
    async passRegisterRenewPassRaw(requestParameters: PassRegisterRenewPassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<RegisterPayinResponseDto>> {
        if (requestParameters.renewPassHolderRequestDto === null || requestParameters.renewPassHolderRequestDto === undefined) {
            throw new runtime.RequiredError('renewPassHolderRequestDto','Required parameter requestParameters.renewPassHolderRequestDto was null or undefined when calling passRegisterRenewPass.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/pass/pay/renew`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RenewPassHolderRequestDtoToJSON(requestParameters.renewPassHolderRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RegisterPayinResponseDtoFromJSON(jsonValue));
    }

    /**
     * Register renew pass payin
     */
    async passRegisterRenewPass(requestParameters: PassRegisterRenewPassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<RegisterPayinResponseDto> {
        const response = await this.passRegisterRenewPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get register renew pass data
     */
    async passRegisterRenewPassDataRaw(requestParameters: PassRegisterRenewPassDataRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<PayinDataDto>> {
        if (requestParameters.renewPassHolderRequestDto === null || requestParameters.renewPassHolderRequestDto === undefined) {
            throw new runtime.RequiredError('renewPassHolderRequestDto','Required parameter requestParameters.renewPassHolderRequestDto was null or undefined when calling passRegisterRenewPassData.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/pass/pay/data/renew`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RenewPassHolderRequestDtoToJSON(requestParameters.renewPassHolderRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PayinDataDtoFromJSON(jsonValue));
    }

    /**
     * Get register renew pass data
     */
    async passRegisterRenewPassData(requestParameters: PassRegisterRenewPassDataRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<PayinDataDto> {
        const response = await this.passRegisterRenewPassDataRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Unpin a pass
     */
    async passUnpinPostRaw(requestParameters: PassUnpinPostRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.passId === null || requestParameters.passId === undefined) {
            throw new runtime.RequiredError('passId','Required parameter requestParameters.passId was null or undefined when calling passUnpinPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/pass/unpin/{passId}`.replace(`{${"passId"}}`, encodeURIComponent(String(requestParameters.passId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Unpin a pass
     */
    async passUnpinPost(requestParameters: PassUnpinPostRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<boolean> {
        const response = await this.passUnpinPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Updates a pass
     */
    async passUpdateRaw(requestParameters: PassUpdateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetPassResponseDto>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling passUpdate.');
        }

        if (requestParameters.updatePassRequestDto === null || requestParameters.updatePassRequestDto === undefined) {
            throw new runtime.RequiredError('updatePassRequestDto','Required parameter requestParameters.updatePassRequestDto was null or undefined when calling passUpdate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/pass/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdatePassRequestDtoToJSON(requestParameters.updatePassRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetPassResponseDtoFromJSON(jsonValue));
    }

    /**
     * Updates a pass
     */
    async passUpdate(requestParameters: PassUpdateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetPassResponseDto> {
        const response = await this.passUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

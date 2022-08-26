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
    AuthWalletRequestDto,
    AuthWalletRequestDtoFromJSON,
    AuthWalletRequestDtoToJSON,
    AuthWalletResponseDto,
    AuthWalletResponseDtoFromJSON,
    AuthWalletResponseDtoToJSON,
    CreateUnauthenticatedWalletRequestDto,
    CreateUnauthenticatedWalletRequestDtoFromJSON,
    CreateUnauthenticatedWalletRequestDtoToJSON,
    CreateWalletRequestDto,
    CreateWalletRequestDtoFromJSON,
    CreateWalletRequestDtoToJSON,
    GetWalletResponseDto,
    GetWalletResponseDtoFromJSON,
    GetWalletResponseDtoToJSON,
    GetWalletsResponseDto,
    GetWalletsResponseDtoFromJSON,
    GetWalletsResponseDtoToJSON,
    WalletResponseDto,
    WalletResponseDtoFromJSON,
    WalletResponseDtoToJSON,
} from '../models';

export interface WalletAuthRequest {
    authWalletRequestDto: AuthWalletRequestDto;
}

export interface WalletCreateRequest {
    createWalletRequestDto: CreateWalletRequestDto;
}

export interface WalletCreateUnauthenticatedRequest {
    createUnauthenticatedWalletRequestDto: CreateUnauthenticatedWalletRequestDto;
}

export interface WalletRefreshRequest {
    id: string;
}

export interface WalletRemoveRequest {
    id: string;
}

export interface WalletSetDefaultWalletRequest {
    walletId: string;
}

/**
 * 
 */
export class WalletApi extends runtime.BaseAPI {

    /**
     * Creates wallet auth message to sign
     */
    async walletAuthRaw(requestParameters: WalletAuthRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<AuthWalletResponseDto>> {
        if (requestParameters.authWalletRequestDto === null || requestParameters.authWalletRequestDto === undefined) {
            throw new runtime.RequiredError('authWalletRequestDto','Required parameter requestParameters.authWalletRequestDto was null or undefined when calling walletAuth.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/wallet/auth`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AuthWalletRequestDtoToJSON(requestParameters.authWalletRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AuthWalletResponseDtoFromJSON(jsonValue));
    }

    /**
     * Creates wallet auth message to sign
     */
    async walletAuth(requestParameters: WalletAuthRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<AuthWalletResponseDto> {
        const response = await this.walletAuthRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates authenticated wallet for a user
     */
    async walletCreateRaw(requestParameters: WalletCreateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<CreateWalletRequestDto>> {
        if (requestParameters.createWalletRequestDto === null || requestParameters.createWalletRequestDto === undefined) {
            throw new runtime.RequiredError('createWalletRequestDto','Required parameter requestParameters.createWalletRequestDto was null or undefined when calling walletCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/wallet`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateWalletRequestDtoToJSON(requestParameters.createWalletRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateWalletRequestDtoFromJSON(jsonValue));
    }

    /**
     * Creates authenticated wallet for a user
     */
    async walletCreate(requestParameters: WalletCreateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<CreateWalletRequestDto> {
        const response = await this.walletCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates unchecked wallet for a user
     */
    async walletCreateUnauthenticatedRaw(requestParameters: WalletCreateUnauthenticatedRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<CreateWalletRequestDto>> {
        if (requestParameters.createUnauthenticatedWalletRequestDto === null || requestParameters.createUnauthenticatedWalletRequestDto === undefined) {
            throw new runtime.RequiredError('createUnauthenticatedWalletRequestDto','Required parameter requestParameters.createUnauthenticatedWalletRequestDto was null or undefined when calling walletCreateUnauthenticated.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/wallet/unauthenticated`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateUnauthenticatedWalletRequestDtoToJSON(requestParameters.createUnauthenticatedWalletRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateWalletRequestDtoFromJSON(jsonValue));
    }

    /**
     * Creates unchecked wallet for a user
     */
    async walletCreateUnauthenticated(requestParameters: WalletCreateUnauthenticatedRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<CreateWalletRequestDto> {
        const response = await this.walletCreateUnauthenticatedRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get wallets for user
     */
    async walletFindAllRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetWalletsResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/wallet`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetWalletsResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get wallets for user
     */
    async walletFindAll(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetWalletsResponseDto> {
        const response = await this.walletFindAllRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get default wallet
     */
    async walletGetDefaultWalletRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetWalletResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/wallet/default`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetWalletResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get default wallet
     */
    async walletGetDefaultWallet(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetWalletResponseDto> {
        const response = await this.walletGetDefaultWalletRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get user custodial wallet
     */
    async walletGetUserCustodialWalletRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetWalletResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/wallet/custodial`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetWalletResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get user custodial wallet
     */
    async walletGetUserCustodialWallet(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetWalletResponseDto> {
        const response = await this.walletGetUserCustodialWalletRaw(initOverrides);
        return await response.value();
    }

    /**
     * Refresh tokens owned by a wallet
     */
    async walletRefreshRaw(requestParameters: WalletRefreshRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<WalletResponseDto>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling walletRefresh.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/wallet/refresh/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => WalletResponseDtoFromJSON(jsonValue));
    }

    /**
     * Refresh tokens owned by a wallet
     */
    async walletRefresh(requestParameters: WalletRefreshRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<WalletResponseDto> {
        const response = await this.walletRefreshRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Removes authenticated wallet for a user
     */
    async walletRemoveRaw(requestParameters: WalletRemoveRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling walletRemove.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/wallet/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Removes authenticated wallet for a user
     */
    async walletRemove(requestParameters: WalletRemoveRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.walletRemoveRaw(requestParameters, initOverrides);
    }

    /**
     * Set default wallet
     */
    async walletSetDefaultWalletRaw(requestParameters: WalletSetDefaultWalletRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.walletId === null || requestParameters.walletId === undefined) {
            throw new runtime.RequiredError('walletId','Required parameter requestParameters.walletId was null or undefined when calling walletSetDefaultWallet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/wallet/default/{walletId}`.replace(`{${"walletId"}}`, encodeURIComponent(String(requestParameters.walletId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Set default wallet
     */
    async walletSetDefaultWallet(requestParameters: WalletSetDefaultWalletRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.walletSetDefaultWalletRaw(requestParameters, initOverrides);
    }

}

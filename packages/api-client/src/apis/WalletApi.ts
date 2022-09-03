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

export interface AuthMessageRequest {
    authWalletRequestDto: AuthWalletRequestDto;
}

export interface CreateUnauthenticatedWalletRequest {
    createUnauthenticatedWalletRequestDto: CreateUnauthenticatedWalletRequestDto;
}

export interface CreateWalletRequest {
    createWalletRequestDto: CreateWalletRequestDto;
}

export interface RefreshWalletsRequest {
    walletId: string;
}

export interface RemoveWalletRequest {
    walletId: string;
}

export interface SetDefaultWalletRequest {
    walletId: string;
}

/**
 * 
 */
export class WalletApi extends runtime.BaseAPI {

    /**
     * Creates wallet auth message to sign
     */
    async authMessageRaw(requestParameters: AuthMessageRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<AuthWalletResponseDto>> {
        if (requestParameters.authWalletRequestDto === null || requestParameters.authWalletRequestDto === undefined) {
            throw new runtime.RequiredError('authWalletRequestDto','Required parameter requestParameters.authWalletRequestDto was null or undefined when calling authMessage.');
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
    async authMessage(requestParameters: AuthMessageRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<AuthWalletResponseDto> {
        const response = await this.authMessageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates unchecked wallet for a user
     */
    async createUnauthenticatedWalletRaw(requestParameters: CreateUnauthenticatedWalletRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<CreateWalletRequestDto>> {
        if (requestParameters.createUnauthenticatedWalletRequestDto === null || requestParameters.createUnauthenticatedWalletRequestDto === undefined) {
            throw new runtime.RequiredError('createUnauthenticatedWalletRequestDto','Required parameter requestParameters.createUnauthenticatedWalletRequestDto was null or undefined when calling createUnauthenticatedWallet.');
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
    async createUnauthenticatedWallet(requestParameters: CreateUnauthenticatedWalletRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<CreateWalletRequestDto> {
        const response = await this.createUnauthenticatedWalletRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates authenticated wallet for a user
     */
    async createWalletRaw(requestParameters: CreateWalletRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<CreateWalletRequestDto>> {
        if (requestParameters.createWalletRequestDto === null || requestParameters.createWalletRequestDto === undefined) {
            throw new runtime.RequiredError('createWalletRequestDto','Required parameter requestParameters.createWalletRequestDto was null or undefined when calling createWallet.');
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
    async createWallet(requestParameters: CreateWalletRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<CreateWalletRequestDto> {
        const response = await this.createWalletRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get default wallet
     */
    async getDefaultWalletRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetWalletResponseDto>> {
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
    async getDefaultWallet(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetWalletResponseDto> {
        const response = await this.getDefaultWalletRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get user custodial wallet
     */
    async getUserCustodialWalletRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetWalletResponseDto>> {
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
    async getUserCustodialWallet(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetWalletResponseDto> {
        const response = await this.getUserCustodialWalletRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get wallets for user
     */
    async getWalletsRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetWalletsResponseDto>> {
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
    async getWallets(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetWalletsResponseDto> {
        const response = await this.getWalletsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Refresh tokens owned by a wallet
     */
    async refreshWalletsRaw(requestParameters: RefreshWalletsRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<WalletResponseDto>> {
        if (requestParameters.walletId === null || requestParameters.walletId === undefined) {
            throw new runtime.RequiredError('walletId','Required parameter requestParameters.walletId was null or undefined when calling refreshWallets.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/wallet/refresh/{walletId}`.replace(`{${"walletId"}}`, encodeURIComponent(String(requestParameters.walletId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => WalletResponseDtoFromJSON(jsonValue));
    }

    /**
     * Refresh tokens owned by a wallet
     */
    async refreshWallets(requestParameters: RefreshWalletsRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<WalletResponseDto> {
        const response = await this.refreshWalletsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Removes authenticated wallet for a user
     */
    async removeWalletRaw(requestParameters: RemoveWalletRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.walletId === null || requestParameters.walletId === undefined) {
            throw new runtime.RequiredError('walletId','Required parameter requestParameters.walletId was null or undefined when calling removeWallet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/wallet/{walletId}`.replace(`{${"walletId"}}`, encodeURIComponent(String(requestParameters.walletId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Removes authenticated wallet for a user
     */
    async removeWallet(requestParameters: RemoveWalletRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.removeWalletRaw(requestParameters, initOverrides);
    }

    /**
     * Set default wallet
     */
    async setDefaultWalletRaw(requestParameters: SetDefaultWalletRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.walletId === null || requestParameters.walletId === undefined) {
            throw new runtime.RequiredError('walletId','Required parameter requestParameters.walletId was null or undefined when calling setDefaultWallet.');
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
    async setDefaultWallet(requestParameters: SetDefaultWalletRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.setDefaultWalletRaw(requestParameters, initOverrides);
    }

}

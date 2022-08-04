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
    CreateWalletDto,
    CreateWalletDtoFromJSON,
    CreateWalletDtoToJSON,
    GetUserWalletsDto,
    GetUserWalletsDtoFromJSON,
    GetUserWalletsDtoToJSON,
    WalletDto,
    WalletDtoFromJSON,
    WalletDtoToJSON,
    WalletResponseDto,
    WalletResponseDtoFromJSON,
    WalletResponseDtoToJSON,
} from '../models';

export interface WalletAuthRequest {
    authWalletRequestDto: AuthWalletRequestDto;
}

export interface WalletCreateRequest {
    createWalletDto: CreateWalletDto;
}

export interface WalletRefreshRequest {
    id: string;
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
    async walletCreateRaw(requestParameters: WalletCreateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<CreateWalletDto>> {
        if (requestParameters.createWalletDto === null || requestParameters.createWalletDto === undefined) {
            throw new runtime.RequiredError('createWalletDto','Required parameter requestParameters.createWalletDto was null or undefined when calling walletCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/wallet`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateWalletDtoToJSON(requestParameters.createWalletDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateWalletDtoFromJSON(jsonValue));
    }

    /**
     * Creates authenticated wallet for a user
     */
    async walletCreate(requestParameters: WalletCreateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<CreateWalletDto> {
        const response = await this.walletCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get wallets for user
     */
    async walletFindAllRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetUserWalletsDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/wallet`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetUserWalletsDtoFromJSON(jsonValue));
    }

    /**
     * Get wallets for user
     */
    async walletFindAll(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetUserWalletsDto> {
        const response = await this.walletFindAllRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get user custodial wallet
     */
    async walletGetUserCustodialWalletRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<WalletDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/wallet/custodial`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => WalletDtoFromJSON(jsonValue));
    }

    /**
     * Get user custodial wallet
     */
    async walletGetUserCustodialWallet(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<WalletDto> {
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

}

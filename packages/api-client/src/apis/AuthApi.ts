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
import type {
  AccessTokensResponseDto,
  CreateUserRequestDto,
  GetUserResponseDto,
  RefreshAuthTokenRequestDto,
  SetEmailRequestDto,
  VerifyEmailDto,
} from '../models';
import {
    AccessTokensResponseDtoFromJSON,
    AccessTokensResponseDtoToJSON,
    CreateUserRequestDtoFromJSON,
    CreateUserRequestDtoToJSON,
    GetUserResponseDtoFromJSON,
    GetUserResponseDtoToJSON,
    RefreshAuthTokenRequestDtoFromJSON,
    RefreshAuthTokenRequestDtoToJSON,
    SetEmailRequestDtoFromJSON,
    SetEmailRequestDtoToJSON,
    VerifyEmailDtoFromJSON,
    VerifyEmailDtoToJSON,
} from '../models';

export interface CreateUserRequest {
    createUserRequestDto: CreateUserRequestDto;
}

export interface RefreshAccessTokenRequest {
    refreshAuthTokenRequestDto: RefreshAuthTokenRequestDto;
}

export interface SetUserEmailRequest {
    setEmailRequestDto: SetEmailRequestDto;
}

export interface VerifyUserEmailRequest {
    verifyEmailDto: VerifyEmailDto;
}

/**
 * 
 */
export class AuthApi extends runtime.BaseAPI {

    /**
     * Creates a new user
     */
    async createUserRaw(requestParameters: CreateUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AccessTokensResponseDto>> {
        if (requestParameters.createUserRequestDto === null || requestParameters.createUserRequestDto === undefined) {
            throw new runtime.RequiredError('createUserRequestDto','Required parameter requestParameters.createUserRequestDto was null or undefined when calling createUser.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/auth/create-user`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateUserRequestDtoToJSON(requestParameters.createUserRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AccessTokensResponseDtoFromJSON(jsonValue));
    }

    /**
     * Creates a new user
     */
    async createUser(requestParameters: CreateUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AccessTokensResponseDto> {
        const response = await this.createUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets the current authenticated user
     */
    async getCurrentUserRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetUserResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/auth/user`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetUserResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets the current authenticated user
     */
    async getCurrentUser(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetUserResponseDto> {
        const response = await this.getCurrentUserRaw(initOverrides);
        return await response.value();
    }

    /**
     * Refresh the access token
     */
    async refreshAccessTokenRaw(requestParameters: RefreshAccessTokenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AccessTokensResponseDto>> {
        if (requestParameters.refreshAuthTokenRequestDto === null || requestParameters.refreshAuthTokenRequestDto === undefined) {
            throw new runtime.RequiredError('refreshAuthTokenRequestDto','Required parameter requestParameters.refreshAuthTokenRequestDto was null or undefined when calling refreshAccessToken.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        /* No auth for endpoint but always send access token */
        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/auth/refresh`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RefreshAuthTokenRequestDtoToJSON(requestParameters.refreshAuthTokenRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AccessTokensResponseDtoFromJSON(jsonValue));
    }

    /**
     * Refresh the access token
     */
    async refreshAccessToken(requestParameters: RefreshAccessTokenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AccessTokensResponseDto> {
        const response = await this.refreshAccessTokenRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Sets the user email
     */
    async setUserEmailRaw(requestParameters: SetUserEmailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.setEmailRequestDto === null || requestParameters.setEmailRequestDto === undefined) {
            throw new runtime.RequiredError('setEmailRequestDto','Required parameter requestParameters.setEmailRequestDto was null or undefined when calling setUserEmail.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/auth/set-email`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SetEmailRequestDtoToJSON(requestParameters.setEmailRequestDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Sets the user email
     */
    async setUserEmail(requestParameters: SetUserEmailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.setUserEmailRaw(requestParameters, initOverrides);
    }

    /**
     * Verify email for the current user
     */
    async verifyUserEmailRaw(requestParameters: VerifyUserEmailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AccessTokensResponseDto>> {
        if (requestParameters.verifyEmailDto === null || requestParameters.verifyEmailDto === undefined) {
            throw new runtime.RequiredError('verifyEmailDto','Required parameter requestParameters.verifyEmailDto was null or undefined when calling verifyUserEmail.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        /* No auth for endpoint but always send access token */
        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/auth/verify-email`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: VerifyEmailDtoToJSON(requestParameters.verifyEmailDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AccessTokensResponseDtoFromJSON(jsonValue));
    }

    /**
     * Verify email for the current user
     */
    async verifyUserEmail(requestParameters: VerifyUserEmailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AccessTokensResponseDto> {
        const response = await this.verifyUserEmailRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

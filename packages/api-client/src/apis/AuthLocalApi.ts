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
  AuthTokenResponseDto,
  CreateLocalUserRequestDto,
  LocalUserLoginRequestDto,
  ResetPasswordRequestDto,
  UpdatePasswordRequestDto,
} from '../models';
import {
    AuthTokenResponseDtoFromJSON,
    AuthTokenResponseDtoToJSON,
    CreateLocalUserRequestDtoFromJSON,
    CreateLocalUserRequestDtoToJSON,
    LocalUserLoginRequestDtoFromJSON,
    LocalUserLoginRequestDtoToJSON,
    ResetPasswordRequestDtoFromJSON,
    ResetPasswordRequestDtoToJSON,
    UpdatePasswordRequestDtoFromJSON,
    UpdatePasswordRequestDtoToJSON,
} from '../models';

export interface ChangePasswordRequest {
    updatePasswordRequestDto: UpdatePasswordRequestDto;
}

export interface CreateEmailPasswordUserRequest {
    createLocalUserRequestDto: CreateLocalUserRequestDto;
}

export interface InitPasswordResetRequest {
    resetPasswordRequestDto: ResetPasswordRequestDto;
}

export interface LoginWithEmailPasswordRequest {
    localUserLoginRequestDto: LocalUserLoginRequestDto;
}

/**
 * 
 */
export class AuthLocalApi extends runtime.BaseAPI {

    /**
     * Change password for current user
     */
    async changePasswordRaw(requestParameters: ChangePasswordRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.updatePasswordRequestDto === null || requestParameters.updatePasswordRequestDto === undefined) {
            throw new runtime.RequiredError('updatePasswordRequestDto','Required parameter requestParameters.updatePasswordRequestDto was null or undefined when calling changePassword.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/auth/local/change-password`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UpdatePasswordRequestDtoToJSON(requestParameters.updatePasswordRequestDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Change password for current user
     */
    async changePassword(requestParameters: ChangePasswordRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.changePasswordRaw(requestParameters, initOverrides);
    }

    /**
     * Create a email and password user
     */
    async createEmailPasswordUserRaw(requestParameters: CreateEmailPasswordUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AuthTokenResponseDto>> {
        if (requestParameters.createLocalUserRequestDto === null || requestParameters.createLocalUserRequestDto === undefined) {
            throw new runtime.RequiredError('createLocalUserRequestDto','Required parameter requestParameters.createLocalUserRequestDto was null or undefined when calling createEmailPasswordUser.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/auth/local/signup`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateLocalUserRequestDtoToJSON(requestParameters.createLocalUserRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AuthTokenResponseDtoFromJSON(jsonValue));
    }

    /**
     * Create a email and password user
     */
    async createEmailPasswordUser(requestParameters: CreateEmailPasswordUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AuthTokenResponseDto> {
        const response = await this.createEmailPasswordUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Send reset password email to user
     */
    async initPasswordResetRaw(requestParameters: InitPasswordResetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.resetPasswordRequestDto === null || requestParameters.resetPasswordRequestDto === undefined) {
            throw new runtime.RequiredError('resetPasswordRequestDto','Required parameter requestParameters.resetPasswordRequestDto was null or undefined when calling initPasswordReset.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/auth/local/reset-password`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ResetPasswordRequestDtoToJSON(requestParameters.resetPasswordRequestDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Send reset password email to user
     */
    async initPasswordReset(requestParameters: InitPasswordResetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.initPasswordResetRaw(requestParameters, initOverrides);
    }

    /**
     * Login with email and password
     */
    async loginWithEmailPasswordRaw(requestParameters: LoginWithEmailPasswordRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AuthTokenResponseDto>> {
        if (requestParameters.localUserLoginRequestDto === null || requestParameters.localUserLoginRequestDto === undefined) {
            throw new runtime.RequiredError('localUserLoginRequestDto','Required parameter requestParameters.localUserLoginRequestDto was null or undefined when calling loginWithEmailPassword.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/auth/local`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: LocalUserLoginRequestDtoToJSON(requestParameters.localUserLoginRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AuthTokenResponseDtoFromJSON(jsonValue));
    }

    /**
     * Login with email and password
     */
    async loginWithEmailPassword(requestParameters: LoginWithEmailPasswordRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AuthTokenResponseDto> {
        const response = await this.loginWithEmailPasswordRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

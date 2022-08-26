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
    AuthTokenResponseDto,
    AuthTokenResponseDtoFromJSON,
    AuthTokenResponseDtoToJSON,
    CreateLocalUserRequestDto,
    CreateLocalUserRequestDtoFromJSON,
    CreateLocalUserRequestDtoToJSON,
    LocalUserLoginRequestDto,
    LocalUserLoginRequestDtoFromJSON,
    LocalUserLoginRequestDtoToJSON,
} from '../models';

export interface LocalAuthCreateEmailPasswordUserRequest {
    createLocalUserRequestDto: CreateLocalUserRequestDto;
}

export interface LocalAuthLoginWithEmailPasswordRequest {
    localUserLoginRequestDto: LocalUserLoginRequestDto;
}

/**
 * 
 */
export class AuthLocalApi extends runtime.BaseAPI {

    /**
     * Create a email and password user
     */
    async localAuthCreateEmailPasswordUserRaw(requestParameters: LocalAuthCreateEmailPasswordUserRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<AuthTokenResponseDto>> {
        if (requestParameters.createLocalUserRequestDto === null || requestParameters.createLocalUserRequestDto === undefined) {
            throw new runtime.RequiredError('createLocalUserRequestDto','Required parameter requestParameters.createLocalUserRequestDto was null or undefined when calling localAuthCreateEmailPasswordUser.');
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
    async localAuthCreateEmailPasswordUser(requestParameters: LocalAuthCreateEmailPasswordUserRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<AuthTokenResponseDto> {
        const response = await this.localAuthCreateEmailPasswordUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Login with email and password
     */
    async localAuthLoginWithEmailPasswordRaw(requestParameters: LocalAuthLoginWithEmailPasswordRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<AuthTokenResponseDto>> {
        if (requestParameters.localUserLoginRequestDto === null || requestParameters.localUserLoginRequestDto === undefined) {
            throw new runtime.RequiredError('localUserLoginRequestDto','Required parameter requestParameters.localUserLoginRequestDto was null or undefined when calling localAuthLoginWithEmailPassword.');
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
    async localAuthLoginWithEmailPassword(requestParameters: LocalAuthLoginWithEmailPasswordRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<AuthTokenResponseDto> {
        const response = await this.localAuthLoginWithEmailPasswordRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

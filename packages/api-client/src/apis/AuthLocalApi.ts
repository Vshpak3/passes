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
    AuthTokenDto,
    AuthTokenDtoFromJSON,
    AuthTokenDtoToJSON,
    CreateLocalUserDto,
    CreateLocalUserDtoFromJSON,
    CreateLocalUserDtoToJSON,
    LocalUserLoginDto,
    LocalUserLoginDtoFromJSON,
    LocalUserLoginDtoToJSON,
} from '../models';

export interface LocalAuthCreateEmailPasswordUserRequest {
    createLocalUserDto: CreateLocalUserDto;
}

export interface LocalAuthLoginWithEmailPasswordRequest {
    localUserLoginDto: LocalUserLoginDto;
}

/**
 * 
 */
export class AuthLocalApi extends runtime.BaseAPI {

    /**
     * Create a email and password user
     */
    async localAuthCreateEmailPasswordUserRaw(requestParameters: LocalAuthCreateEmailPasswordUserRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.createLocalUserDto === null || requestParameters.createLocalUserDto === undefined) {
            throw new runtime.RequiredError('createLocalUserDto','Required parameter requestParameters.createLocalUserDto was null or undefined when calling localAuthCreateEmailPasswordUser.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/auth/local/signup`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateLocalUserDtoToJSON(requestParameters.createLocalUserDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Create a email and password user
     */
    async localAuthCreateEmailPasswordUser(requestParameters: LocalAuthCreateEmailPasswordUserRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.localAuthCreateEmailPasswordUserRaw(requestParameters, initOverrides);
    }

    /**
     * Login with email and password
     */
    async localAuthLoginWithEmailPasswordRaw(requestParameters: LocalAuthLoginWithEmailPasswordRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<AuthTokenDto>> {
        if (requestParameters.localUserLoginDto === null || requestParameters.localUserLoginDto === undefined) {
            throw new runtime.RequiredError('localUserLoginDto','Required parameter requestParameters.localUserLoginDto was null or undefined when calling localAuthLoginWithEmailPassword.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/auth/local`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: LocalUserLoginDtoToJSON(requestParameters.localUserLoginDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AuthTokenDtoFromJSON(jsonValue));
    }

    /**
     * Login with email and password
     */
    async localAuthLoginWithEmailPassword(requestParameters: LocalAuthLoginWithEmailPasswordRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<AuthTokenDto> {
        const response = await this.localAuthLoginWithEmailPasswordRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

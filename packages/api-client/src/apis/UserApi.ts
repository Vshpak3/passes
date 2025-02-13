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
  BooleanResponseDto,
  IsPasswordUserResponseDto,
  SearchCreatorRequestDto,
  SearchCreatorResponseDto,
  UpdateDisplayNameRequestDto,
  UpdateUsernameRequestDto,
} from '../models';
import {
    BooleanResponseDtoFromJSON,
    BooleanResponseDtoToJSON,
    IsPasswordUserResponseDtoFromJSON,
    IsPasswordUserResponseDtoToJSON,
    SearchCreatorRequestDtoFromJSON,
    SearchCreatorRequestDtoToJSON,
    SearchCreatorResponseDtoFromJSON,
    SearchCreatorResponseDtoToJSON,
    UpdateDisplayNameRequestDtoFromJSON,
    UpdateDisplayNameRequestDtoToJSON,
    UpdateUsernameRequestDtoFromJSON,
    UpdateUsernameRequestDtoToJSON,
} from '../models';

export interface GetUserIdRequest {
    username: string;
}

export interface GetUsernameFromIdRequest {
    userId: string;
}

export interface IsCreatorRequest {
    userId: string;
}

export interface IsUsernameTakenRequest {
    updateUsernameRequestDto: UpdateUsernameRequestDto;
}

export interface SearchCreatorRequest {
    searchCreatorRequestDto: SearchCreatorRequestDto;
}

export interface SetDisplayNameRequest {
    updateDisplayNameRequestDto: UpdateDisplayNameRequestDto;
}

export interface SetUsernameRequest {
    updateUsernameRequestDto: UpdateUsernameRequestDto;
}

/**
 * 
 */
export class UserApi extends runtime.BaseAPI {

    /**
     * Activate a user account
     */
    async activateUserRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/user/activate`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Activate a user account
     */
    async activateUser(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.activateUserRaw(initOverrides);
        return await response.value();
    }

    /**
     * Deactivate a user account
     */
    async deactivateUserRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/user/deactivate`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Deactivate a user account
     */
    async deactivateUser(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.deactivateUserRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get featured creators
     */
    async featuredCreatorsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SearchCreatorResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        /* No auth for endpoint but always send access token */
        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/user/creator/featured`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SearchCreatorResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get featured creators
     */
    async featuredCreators(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SearchCreatorResponseDto> {
        const response = await this.featuredCreatorsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get user id from username
     */
    async getUserIdRaw(requestParameters: GetUserIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters.username === null || requestParameters.username === undefined) {
            throw new runtime.RequiredError('username','Required parameter requestParameters.username was null or undefined when calling getUserId.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/user/username/{username}`.replace(`{${"username"}}`, encodeURIComponent(String(requestParameters.username))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Get user id from username
     */
    async getUserId(requestParameters: GetUserIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.getUserIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get user id from username
     */
    async getUsernameFromIdRaw(requestParameters: GetUsernameFromIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        if (requestParameters.userId === null || requestParameters.userId === undefined) {
            throw new runtime.RequiredError('userId','Required parameter requestParameters.userId was null or undefined when calling getUsernameFromId.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        /* No auth for endpoint but always send access token */
        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/user/user-id/{userId}`.replace(`{${"userId"}}`, encodeURIComponent(String(requestParameters.userId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Get user id from username
     */
    async getUsernameFromId(requestParameters: GetUsernameFromIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.getUsernameFromIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Check if user is a creator
     */
    async isCreatorRaw(requestParameters: IsCreatorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.userId === null || requestParameters.userId === undefined) {
            throw new runtime.RequiredError('userId','Required parameter requestParameters.userId was null or undefined when calling isCreator.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/user/creator/check/{userId}`.replace(`{${"userId"}}`, encodeURIComponent(String(requestParameters.userId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Check if user is a creator
     */
    async isCreator(requestParameters: IsCreatorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.isCreatorRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get if user uses a password
     */
    async isPasswordUserRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IsPasswordUserResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/user/is-password`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IsPasswordUserResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get if user uses a password
     */
    async isPasswordUser(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IsPasswordUserResponseDto> {
        const response = await this.isPasswordUserRaw(initOverrides);
        return await response.value();
    }

    /**
     * Validates whether a username is available
     */
    async isUsernameTakenRaw(requestParameters: IsUsernameTakenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.updateUsernameRequestDto === null || requestParameters.updateUsernameRequestDto === undefined) {
            throw new runtime.RequiredError('updateUsernameRequestDto','Required parameter requestParameters.updateUsernameRequestDto was null or undefined when calling isUsernameTaken.');
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
            path: `/api/user/username/validate`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateUsernameRequestDtoToJSON(requestParameters.updateUsernameRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Validates whether a username is available
     */
    async isUsernameTaken(requestParameters: IsUsernameTakenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.isUsernameTakenRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Flags self as adult
     */
    async makeAdultRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/user/adult`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Flags self as adult
     */
    async makeAdult(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.makeAdultRaw(initOverrides);
    }

    /**
     * patrick whitelisted users
     */
    async patrickWhitelistRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/user/patrick`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * patrick whitelisted users
     */
    async patrickWhitelist(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.patrickWhitelistRaw(initOverrides);
    }

    /**
     * Search for creators by query
     */
    async searchCreatorRaw(requestParameters: SearchCreatorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SearchCreatorResponseDto>> {
        if (requestParameters.searchCreatorRequestDto === null || requestParameters.searchCreatorRequestDto === undefined) {
            throw new runtime.RequiredError('searchCreatorRequestDto','Required parameter requestParameters.searchCreatorRequestDto was null or undefined when calling searchCreator.');
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
            path: `/api/user/creator/search`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SearchCreatorRequestDtoToJSON(requestParameters.searchCreatorRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SearchCreatorResponseDtoFromJSON(jsonValue));
    }

    /**
     * Search for creators by query
     */
    async searchCreator(requestParameters: SearchCreatorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SearchCreatorResponseDto> {
        const response = await this.searchCreatorRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Set display name for current user
     */
    async setDisplayNameRaw(requestParameters: SetDisplayNameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.updateDisplayNameRequestDto === null || requestParameters.updateDisplayNameRequestDto === undefined) {
            throw new runtime.RequiredError('updateDisplayNameRequestDto','Required parameter requestParameters.updateDisplayNameRequestDto was null or undefined when calling setDisplayName.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/user/set-display-name`,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateDisplayNameRequestDtoToJSON(requestParameters.updateDisplayNameRequestDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Set display name for current user
     */
    async setDisplayName(requestParameters: SetDisplayNameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.setDisplayNameRaw(requestParameters, initOverrides);
    }

    /**
     * Set username for current user
     */
    async setUsernameRaw(requestParameters: SetUsernameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.updateUsernameRequestDto === null || requestParameters.updateUsernameRequestDto === undefined) {
            throw new runtime.RequiredError('updateUsernameRequestDto','Required parameter requestParameters.updateUsernameRequestDto was null or undefined when calling setUsername.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/user/set-username`,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateUsernameRequestDtoToJSON(requestParameters.updateUsernameRequestDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Set username for current user
     */
    async setUsername(requestParameters: SetUsernameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.setUsernameRaw(requestParameters, initOverrides);
    }

}

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
    CreateOrUpdateProfileRequestDto,
    CreateOrUpdateProfileRequestDtoFromJSON,
    CreateOrUpdateProfileRequestDtoToJSON,
    GetProfileResponseDto,
    GetProfileResponseDtoFromJSON,
    GetProfileResponseDtoToJSON,
    GetUsernamesResponseDto,
    GetUsernamesResponseDtoFromJSON,
    GetUsernamesResponseDtoToJSON,
} from '../models';

export interface CreateOrUpdateProfileRequest {
    createOrUpdateProfileRequestDto: CreateOrUpdateProfileRequestDto;
}

export interface FindProfileRequest {
    profileId: string;
}

export interface FindProfileByUsernameRequest {
    username: string;
}

export interface RemoveProfileRequest {
    profileId: string;
}

/**
 * 
 */
export class ProfileApi extends runtime.BaseAPI {

    /**
     * Creates a profile
     */
    async createOrUpdateProfileRaw(requestParameters: CreateOrUpdateProfileRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.createOrUpdateProfileRequestDto === null || requestParameters.createOrUpdateProfileRequestDto === undefined) {
            throw new runtime.RequiredError('createOrUpdateProfileRequestDto','Required parameter requestParameters.createOrUpdateProfileRequestDto was null or undefined when calling createOrUpdateProfile.');
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
            path: `/api/profile`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateOrUpdateProfileRequestDtoToJSON(requestParameters.createOrUpdateProfileRequestDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Creates a profile
     */
    async createOrUpdateProfile(requestParameters: CreateOrUpdateProfileRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<boolean> {
        const response = await this.createOrUpdateProfileRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets a profile
     */
    async findProfileRaw(requestParameters: FindProfileRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetProfileResponseDto>> {
        if (requestParameters.profileId === null || requestParameters.profileId === undefined) {
            throw new runtime.RequiredError('profileId','Required parameter requestParameters.profileId was null or undefined when calling findProfile.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/profile/{profileId}`.replace(`{${"profileId"}}`, encodeURIComponent(String(requestParameters.profileId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProfileResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets a profile
     */
    async findProfile(requestParameters: FindProfileRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetProfileResponseDto> {
        const response = await this.findProfileRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets a profile by username
     */
    async findProfileByUsernameRaw(requestParameters: FindProfileByUsernameRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetProfileResponseDto>> {
        if (requestParameters.username === null || requestParameters.username === undefined) {
            throw new runtime.RequiredError('username','Required parameter requestParameters.username was null or undefined when calling findProfileByUsername.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/profile/usernames/{username}`.replace(`{${"username"}}`, encodeURIComponent(String(requestParameters.username))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetProfileResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets a profile by username
     */
    async findProfileByUsername(requestParameters: FindProfileByUsernameRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetProfileResponseDto> {
        const response = await this.findProfileByUsernameRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets all usernames
     */
    async getAllUsernamesRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetUsernamesResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/profile/usernames`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetUsernamesResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets all usernames
     */
    async getAllUsernames(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetUsernamesResponseDto> {
        const response = await this.getAllUsernamesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Deletes a profile
     */
    async removeProfileRaw(requestParameters: RemoveProfileRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.profileId === null || requestParameters.profileId === undefined) {
            throw new runtime.RequiredError('profileId','Required parameter requestParameters.profileId was null or undefined when calling removeProfile.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/profile/{profileId}`.replace(`{${"profileId"}}`, encodeURIComponent(String(requestParameters.profileId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Deletes a profile
     */
    async removeProfile(requestParameters: RemoveProfileRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<boolean> {
        const response = await this.removeProfileRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

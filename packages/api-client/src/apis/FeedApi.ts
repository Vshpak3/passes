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
  GetFeedRequestDto,
  GetFeedResponseDto,
  GetPostsRequestDto,
  GetProfileFeedRequestDto,
} from '../models';
import {
    GetFeedRequestDtoFromJSON,
    GetFeedRequestDtoToJSON,
    GetFeedResponseDtoFromJSON,
    GetFeedResponseDtoToJSON,
    GetPostsRequestDtoFromJSON,
    GetPostsRequestDtoToJSON,
    GetProfileFeedRequestDtoFromJSON,
    GetProfileFeedRequestDtoToJSON,
} from '../models';

export interface GetFeedRequest {
    getFeedRequestDto: GetFeedRequestDto;
}

export interface GetFeedForCreatorRequest {
    getProfileFeedRequestDto: GetProfileFeedRequestDto;
}

export interface GetMessagesForOwnerRequest {
    getPostsRequestDto: GetPostsRequestDto;
}

export interface GetPostsForOwnerRequest {
    getPostsRequestDto: GetPostsRequestDto;
}

/**
 * 
 */
export class FeedApi extends runtime.BaseAPI {

    /**
     * Gets a users feed
     */
    async getFeedRaw(requestParameters: GetFeedRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetFeedResponseDto>> {
        if (requestParameters.getFeedRequestDto === null || requestParameters.getFeedRequestDto === undefined) {
            throw new runtime.RequiredError('getFeedRequestDto','Required parameter requestParameters.getFeedRequestDto was null or undefined when calling getFeed.');
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
            path: `/api/feed`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GetFeedRequestDtoToJSON(requestParameters.getFeedRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetFeedResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets a users feed
     */
    async getFeed(requestParameters: GetFeedRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetFeedResponseDto> {
        const response = await this.getFeedRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets a feed for a given creator
     */
    async getFeedForCreatorRaw(requestParameters: GetFeedForCreatorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetFeedResponseDto>> {
        if (requestParameters.getProfileFeedRequestDto === null || requestParameters.getProfileFeedRequestDto === undefined) {
            throw new runtime.RequiredError('getProfileFeedRequestDto','Required parameter requestParameters.getProfileFeedRequestDto was null or undefined when calling getFeedForCreator.');
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
            path: `/api/feed/profile`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GetProfileFeedRequestDtoToJSON(requestParameters.getProfileFeedRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetFeedResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets a feed for a given creator
     */
    async getFeedForCreator(requestParameters: GetFeedForCreatorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetFeedResponseDto> {
        const response = await this.getFeedForCreatorRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets my messages
     */
    async getMessagesForOwnerRaw(requestParameters: GetMessagesForOwnerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetFeedResponseDto>> {
        if (requestParameters.getPostsRequestDto === null || requestParameters.getPostsRequestDto === undefined) {
            throw new runtime.RequiredError('getPostsRequestDto','Required parameter requestParameters.getPostsRequestDto was null or undefined when calling getMessagesForOwner.');
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
            path: `/api/feed/owner/messages`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
            body: GetPostsRequestDtoToJSON(requestParameters.getPostsRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetFeedResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets my messages
     */
    async getMessagesForOwner(requestParameters: GetMessagesForOwnerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetFeedResponseDto> {
        const response = await this.getMessagesForOwnerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets my posts
     */
    async getPostsForOwnerRaw(requestParameters: GetPostsForOwnerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetFeedResponseDto>> {
        if (requestParameters.getPostsRequestDto === null || requestParameters.getPostsRequestDto === undefined) {
            throw new runtime.RequiredError('getPostsRequestDto','Required parameter requestParameters.getPostsRequestDto was null or undefined when calling getPostsForOwner.');
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
            path: `/api/feed/owner/posts`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GetPostsRequestDtoToJSON(requestParameters.getPostsRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetFeedResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets my posts
     */
    async getPostsForOwner(requestParameters: GetPostsForOwnerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetFeedResponseDto> {
        const response = await this.getPostsForOwnerRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

export const FeedSecurityInfo = new Set<string>([
    "getFeed",
    "getFeedForCreator",
    "getMessagesForOwner",
    "getPostsForOwner",
])

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
    GetFeedResponseDto,
    GetFeedResponseDtoFromJSON,
    GetFeedResponseDtoToJSON,
} from '../models';

export interface GetFeedRequest {
    cursor: string;
}

export interface GetFeedForCreatorRequest {
    userId: string;
    cursor: string;
}

export interface GetMessagesCreatorRequest {
    cursor: string;
}

export interface GetPostsForCreatorRequest {
    cursor: string;
}

/**
 * 
 */
export class FeedApi extends runtime.BaseAPI {

    /**
     * Gets a users feed
     */
    async getFeedRaw(requestParameters: GetFeedRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetFeedResponseDto>> {
        if (requestParameters.cursor === null || requestParameters.cursor === undefined) {
            throw new runtime.RequiredError('cursor','Required parameter requestParameters.cursor was null or undefined when calling getFeed.');
        }

        const queryParameters: any = {};

        if (requestParameters.cursor !== undefined) {
            queryParameters['cursor'] = requestParameters.cursor;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/feed`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetFeedResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets a users feed
     */
    async getFeed(requestParameters: GetFeedRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetFeedResponseDto> {
        const response = await this.getFeedRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets a feed for a given creator
     */
    async getFeedForCreatorRaw(requestParameters: GetFeedForCreatorRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetFeedResponseDto>> {
        if (requestParameters.userId === null || requestParameters.userId === undefined) {
            throw new runtime.RequiredError('userId','Required parameter requestParameters.userId was null or undefined when calling getFeedForCreator.');
        }

        if (requestParameters.cursor === null || requestParameters.cursor === undefined) {
            throw new runtime.RequiredError('cursor','Required parameter requestParameters.cursor was null or undefined when calling getFeedForCreator.');
        }

        const queryParameters: any = {};

        if (requestParameters.cursor !== undefined) {
            queryParameters['cursor'] = requestParameters.cursor;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/feed/{userId}`.replace(`{${"userId"}}`, encodeURIComponent(String(requestParameters.userId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetFeedResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets a feed for a given creator
     */
    async getFeedForCreator(requestParameters: GetFeedForCreatorRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetFeedResponseDto> {
        const response = await this.getFeedForCreatorRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets my messages
     */
    async getMessagesCreatorRaw(requestParameters: GetMessagesCreatorRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetFeedResponseDto>> {
        if (requestParameters.cursor === null || requestParameters.cursor === undefined) {
            throw new runtime.RequiredError('cursor','Required parameter requestParameters.cursor was null or undefined when calling getMessagesCreator.');
        }

        const queryParameters: any = {};

        if (requestParameters.cursor !== undefined) {
            queryParameters['cursor'] = requestParameters.cursor;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/feed/creator/messages`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetFeedResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets my messages
     */
    async getMessagesCreator(requestParameters: GetMessagesCreatorRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetFeedResponseDto> {
        const response = await this.getMessagesCreatorRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets my posts
     */
    async getPostsForCreatorRaw(requestParameters: GetPostsForCreatorRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetFeedResponseDto>> {
        if (requestParameters.cursor === null || requestParameters.cursor === undefined) {
            throw new runtime.RequiredError('cursor','Required parameter requestParameters.cursor was null or undefined when calling getPostsForCreator.');
        }

        const queryParameters: any = {};

        if (requestParameters.cursor !== undefined) {
            queryParameters['cursor'] = requestParameters.cursor;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/feed/creator/posts`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetFeedResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets my posts
     */
    async getPostsForCreator(requestParameters: GetPostsForCreatorRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetFeedResponseDto> {
        const response = await this.getPostsForCreatorRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

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
    GetFeedDto,
    GetFeedDtoFromJSON,
    GetFeedDtoToJSON,
} from '../models';

export interface FeedGetFeedRequest {
    cursor: string;
}

export interface FeedGetPostsForCreatorRequest {
    username: string;
    cursor: string;
}

/**
 * 
 */
export class FeedApi extends runtime.BaseAPI {

    /**
     * Gets a users feed
     */
    async feedGetFeedRaw(requestParameters: FeedGetFeedRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetFeedDto>> {
        if (requestParameters.cursor === null || requestParameters.cursor === undefined) {
            throw new runtime.RequiredError('cursor','Required parameter requestParameters.cursor was null or undefined when calling feedGetFeed.');
        }

        const queryParameters: any = {};

        if (requestParameters.cursor !== undefined) {
            queryParameters['cursor'] = requestParameters.cursor;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/feed`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetFeedDtoFromJSON(jsonValue));
    }

    /**
     * Gets a users feed
     */
    async feedGetFeed(requestParameters: FeedGetFeedRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetFeedDto> {
        const response = await this.feedGetFeedRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets a list of posts for a given creator
     */
    async feedGetPostsForCreatorRaw(requestParameters: FeedGetPostsForCreatorRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetFeedDto>> {
        if (requestParameters.username === null || requestParameters.username === undefined) {
            throw new runtime.RequiredError('username','Required parameter requestParameters.username was null or undefined when calling feedGetPostsForCreator.');
        }

        if (requestParameters.cursor === null || requestParameters.cursor === undefined) {
            throw new runtime.RequiredError('cursor','Required parameter requestParameters.cursor was null or undefined when calling feedGetPostsForCreator.');
        }

        const queryParameters: any = {};

        if (requestParameters.cursor !== undefined) {
            queryParameters['cursor'] = requestParameters.cursor;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/feed/{username}`.replace(`{${"username"}}`, encodeURIComponent(String(requestParameters.username))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetFeedDtoFromJSON(jsonValue));
    }

    /**
     * Gets a list of posts for a given creator
     */
    async feedGetPostsForCreator(requestParameters: FeedGetPostsForCreatorRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetFeedDto> {
        const response = await this.feedGetPostsForCreatorRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

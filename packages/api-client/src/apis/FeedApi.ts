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
  GetProfileFeedRequestDto,
} from '../models';
import {
    GetFeedRequestDtoFromJSON,
    GetFeedRequestDtoToJSON,
    GetFeedResponseDtoFromJSON,
    GetFeedResponseDtoToJSON,
    GetProfileFeedRequestDtoFromJSON,
    GetProfileFeedRequestDtoToJSON,
} from '../models';

export interface GetFeedRequest {
    getFeedRequestDto: GetFeedRequestDto;
}

export interface GetFeedForCreatorRequest {
    getProfileFeedRequestDto: GetProfileFeedRequestDto;
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

        const token = window.localStorage.getItem("access-token")

        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
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

        const token = window.localStorage.getItem("access-token")

        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
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

}

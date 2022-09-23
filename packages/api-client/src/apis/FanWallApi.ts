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
  CreateFanWallCommentRequestDto,
  GetFanWallRequestDto,
  GetFanWallResponseDto,
} from '../models';
import {
    CreateFanWallCommentRequestDtoFromJSON,
    CreateFanWallCommentRequestDtoToJSON,
    GetFanWallRequestDtoFromJSON,
    GetFanWallRequestDtoToJSON,
    GetFanWallResponseDtoFromJSON,
    GetFanWallResponseDtoToJSON,
} from '../models';

export interface CreateFanWallCommentRequest {
    createFanWallCommentRequestDto: CreateFanWallCommentRequestDto;
}

export interface DeleteFanWallCommentRequest {
    fanWallCommentId: string;
}

export interface GetFanWallForCreatorRequest {
    getFanWallRequestDto: GetFanWallRequestDto;
}

export interface HideFanWallCommentRequest {
    fanWallCommentId: string;
}

/**
 * 
 */
export class FanWallApi extends runtime.BaseAPI {

    /**
     * Creates a fan wall comment
     */
    async createFanWallCommentRaw(requestParameters: CreateFanWallCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.createFanWallCommentRequestDto === null || requestParameters.createFanWallCommentRequestDto === undefined) {
            throw new runtime.RequiredError('createFanWallCommentRequestDto','Required parameter requestParameters.createFanWallCommentRequestDto was null or undefined when calling createFanWallComment.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")

        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }
        const response = await this.request({
            path: `/api/fan-wall`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateFanWallCommentRequestDtoToJSON(requestParameters.createFanWallCommentRequestDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Creates a fan wall comment
     */
    async createFanWallComment(requestParameters: CreateFanWallCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<boolean> {
        const response = await this.createFanWallCommentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Deletes a fan wall comment
     */
    async deleteFanWallCommentRaw(requestParameters: DeleteFanWallCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.fanWallCommentId === null || requestParameters.fanWallCommentId === undefined) {
            throw new runtime.RequiredError('fanWallCommentId','Required parameter requestParameters.fanWallCommentId was null or undefined when calling deleteFanWallComment.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")

        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }
        const response = await this.request({
            path: `/api/fan-wall/{fanWallCommentId}`.replace(`{${"fanWallCommentId"}}`, encodeURIComponent(String(requestParameters.fanWallCommentId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Deletes a fan wall comment
     */
    async deleteFanWallComment(requestParameters: DeleteFanWallCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<boolean> {
        const response = await this.deleteFanWallCommentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets fan wall for a creator
     */
    async getFanWallForCreatorRaw(requestParameters: GetFanWallForCreatorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetFanWallResponseDto>> {
        if (requestParameters.getFanWallRequestDto === null || requestParameters.getFanWallRequestDto === undefined) {
            throw new runtime.RequiredError('getFanWallRequestDto','Required parameter requestParameters.getFanWallRequestDto was null or undefined when calling getFanWallForCreator.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")

        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }
        const response = await this.request({
            path: `/api/fan-wall/profile`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GetFanWallRequestDtoToJSON(requestParameters.getFanWallRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetFanWallResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets fan wall for a creator
     */
    async getFanWallForCreator(requestParameters: GetFanWallForCreatorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetFanWallResponseDto> {
        const response = await this.getFanWallForCreatorRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Hides a fan wall comment
     */
    async hideFanWallCommentRaw(requestParameters: HideFanWallCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.fanWallCommentId === null || requestParameters.fanWallCommentId === undefined) {
            throw new runtime.RequiredError('fanWallCommentId','Required parameter requestParameters.fanWallCommentId was null or undefined when calling hideFanWallComment.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")

        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }
        const response = await this.request({
            path: `/api/fan-wall/{fanWallCommentId}`.replace(`{${"fanWallCommentId"}}`, encodeURIComponent(String(requestParameters.fanWallCommentId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Hides a fan wall comment
     */
    async hideFanWallComment(requestParameters: HideFanWallCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<boolean> {
        const response = await this.hideFanWallCommentRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

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
  GetCreatorEarningResponseDto,
  GetCreatorEarningsHistoryRequestDto,
  GetCreatorEarningsResponseDto,
  GetCreatorStatsResponseDto,
} from '../models';
import {
    GetCreatorEarningResponseDtoFromJSON,
    GetCreatorEarningResponseDtoToJSON,
    GetCreatorEarningsHistoryRequestDtoFromJSON,
    GetCreatorEarningsHistoryRequestDtoToJSON,
    GetCreatorEarningsResponseDtoFromJSON,
    GetCreatorEarningsResponseDtoToJSON,
    GetCreatorStatsResponseDtoFromJSON,
    GetCreatorStatsResponseDtoToJSON,
} from '../models';

export interface GetCreatorStatsRequest {
    creatorId: string;
}

export interface GetEarningsHistoryRequest {
    getCreatorEarningsHistoryRequestDto: GetCreatorEarningsHistoryRequestDto;
}

/**
 * 
 */
export class CreatorStatsApi extends runtime.BaseAPI {

    /**
     * Get available balance
     */
    async getAvailableBalanceRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCreatorEarningResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/creator-stats/available-balance`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCreatorEarningResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get available balance
     */
    async getAvailableBalance(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCreatorEarningResponseDto> {
        const response = await this.getAvailableBalanceRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get balance
     */
    async getBalanceRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCreatorEarningResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/creator-stats/balance`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCreatorEarningResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get balance
     */
    async getBalance(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCreatorEarningResponseDto> {
        const response = await this.getBalanceRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get current stats
     */
    async getCreatorStatsRaw(requestParameters: GetCreatorStatsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCreatorStatsResponseDto>> {
        if (requestParameters.creatorId === null || requestParameters.creatorId === undefined) {
            throw new runtime.RequiredError('creatorId','Required parameter requestParameters.creatorId was null or undefined when calling getCreatorStats.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        /* No auth for endpoint but always send access token */
        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/creator-stats/stats/{creatorId}`.replace(`{${"creatorId"}}`, encodeURIComponent(String(requestParameters.creatorId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCreatorStatsResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get current stats
     */
    async getCreatorStats(requestParameters: GetCreatorStatsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCreatorStatsResponseDto> {
        const response = await this.getCreatorStatsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get earnings history
     */
    async getEarningsHistoryRaw(requestParameters: GetEarningsHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCreatorEarningsResponseDto>> {
        if (requestParameters.getCreatorEarningsHistoryRequestDto === null || requestParameters.getCreatorEarningsHistoryRequestDto === undefined) {
            throw new runtime.RequiredError('getCreatorEarningsHistoryRequestDto','Required parameter requestParameters.getCreatorEarningsHistoryRequestDto was null or undefined when calling getEarningsHistory.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/creator-stats/history/earnings`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GetCreatorEarningsHistoryRequestDtoToJSON(requestParameters.getCreatorEarningsHistoryRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCreatorEarningsResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get earnings history
     */
    async getEarningsHistory(requestParameters: GetEarningsHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCreatorEarningsResponseDto> {
        const response = await this.getEarningsHistoryRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

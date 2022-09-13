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

export interface GetHistoricEarningsRequest {
    getCreatorEarningsHistoryRequestDto: GetCreatorEarningsHistoryRequestDto;
}

/**
 * 
 */
export class CreatorStatsApi extends runtime.BaseAPI {

    /**
     * Get balance
     */
    async getBalanceRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCreatorEarningResponseDto>> {
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
     * Get historic earnings
     */
    async getHistoricEarningsRaw(requestParameters: GetHistoricEarningsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCreatorEarningsResponseDto>> {
        if (requestParameters.getCreatorEarningsHistoryRequestDto === null || requestParameters.getCreatorEarningsHistoryRequestDto === undefined) {
            throw new runtime.RequiredError('getCreatorEarningsHistoryRequestDto','Required parameter requestParameters.getCreatorEarningsHistoryRequestDto was null or undefined when calling getHistoricEarnings.');
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
            path: `/api/creator-stats/earnings/historic`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GetCreatorEarningsHistoryRequestDtoToJSON(requestParameters.getCreatorEarningsHistoryRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCreatorEarningsResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get historic earnings
     */
    async getHistoricEarnings(requestParameters: GetHistoricEarningsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCreatorEarningsResponseDto> {
        const response = await this.getHistoricEarningsRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

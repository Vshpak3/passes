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
    GetCreatorEarningResponseDto,
    GetCreatorEarningResponseDtoFromJSON,
    GetCreatorEarningResponseDtoToJSON,
    GetCreatorEarningsHistoryRequestDto,
    GetCreatorEarningsHistoryRequestDtoFromJSON,
    GetCreatorEarningsHistoryRequestDtoToJSON,
    GetCreatorEarningsResponseDto,
    GetCreatorEarningsResponseDtoFromJSON,
    GetCreatorEarningsResponseDtoToJSON,
} from '../models';

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
    async getBalanceRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetCreatorEarningResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

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
    async getBalance(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetCreatorEarningResponseDto> {
        const response = await this.getBalanceRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get historic earnings
     */
    async getHistoricEarningsRaw(requestParameters: GetHistoricEarningsRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetCreatorEarningsResponseDto>> {
        if (requestParameters.getCreatorEarningsHistoryRequestDto === null || requestParameters.getCreatorEarningsHistoryRequestDto === undefined) {
            throw new runtime.RequiredError('getCreatorEarningsHistoryRequestDto','Required parameter requestParameters.getCreatorEarningsHistoryRequestDto was null or undefined when calling getHistoricEarnings.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

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
    async getHistoricEarnings(requestParameters: GetHistoricEarningsRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetCreatorEarningsResponseDto> {
        const response = await this.getHistoricEarningsRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

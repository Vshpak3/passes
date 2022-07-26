/* tslint:disable */
/* eslint-disable */
/**
 * Moment Backend
 * Be in the moment
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';

/**
 * 
 */
export class HealthApi extends runtime.BaseAPI {

    /**
     * Health check endpoint
     */
    async healthHealthRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<string>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/health`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Health check endpoint
     */
    async healthHealth(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<string> {
        const response = await this.healthHealthRaw(initOverrides);
        return await response.value();
    }

}

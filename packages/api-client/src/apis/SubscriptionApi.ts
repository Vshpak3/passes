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

export interface SubscriptionCreateRequest {
    body: object;
}

export interface SubscriptionFindOneRequest {
    id: string;
}

export interface SubscriptionRemoveRequest {
    id: string;
}

export interface SubscriptionUpdateRequest {
    id: string;
    body: object;
}

/**
 * 
 */
export class SubscriptionApi extends runtime.BaseAPI {

    /**
     * Creates a subscription
     */
    async subscriptionCreateRaw(requestParameters: SubscriptionCreateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<object>> {
        if (requestParameters.body === null || requestParameters.body === undefined) {
            throw new runtime.RequiredError('body','Required parameter requestParameters.body was null or undefined when calling subscriptionCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/subscription`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Creates a subscription
     */
    async subscriptionCreate(requestParameters: SubscriptionCreateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<object> {
        const response = await this.subscriptionCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets a subscription
     */
    async subscriptionFindOneRaw(requestParameters: SubscriptionFindOneRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<object>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling subscriptionFindOne.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/subscription/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     * Gets a subscription
     */
    async subscriptionFindOne(requestParameters: SubscriptionFindOneRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<object> {
        const response = await this.subscriptionFindOneRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Deletes a subscription
     */
    async subscriptionRemoveRaw(requestParameters: SubscriptionRemoveRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling subscriptionRemove.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/subscription/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes a subscription
     */
    async subscriptionRemove(requestParameters: SubscriptionRemoveRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.subscriptionRemoveRaw(requestParameters, initOverrides);
    }

    /**
     * Updates a subscription
     */
    async subscriptionUpdateRaw(requestParameters: SubscriptionUpdateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling subscriptionUpdate.');
        }

        if (requestParameters.body === null || requestParameters.body === undefined) {
            throw new runtime.RequiredError('body','Required parameter requestParameters.body was null or undefined when calling subscriptionUpdate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/subscription/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Updates a subscription
     */
    async subscriptionUpdate(requestParameters: SubscriptionUpdateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.subscriptionUpdateRaw(requestParameters, initOverrides);
    }

}

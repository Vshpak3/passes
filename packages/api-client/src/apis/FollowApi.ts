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
    CreateFollowingRequestDto,
    CreateFollowingRequestDtoFromJSON,
    CreateFollowingRequestDtoToJSON,
    GetFansResponseDto,
    GetFansResponseDtoFromJSON,
    GetFansResponseDtoToJSON,
} from '../models';

export interface FollowBlockRequest {
    id: string;
    body: string;
}

export interface FollowCreateRequest {
    createFollowingRequestDto: CreateFollowingRequestDto;
}

export interface FollowFindOneRequest {
    id: string;
}

export interface FollowRemoveRequest {
    id: string;
}

export interface FollowReportRequest {
    id: string;
    body: string;
}

export interface FollowRestrictRequest {
    id: string;
    body: string;
}

export interface FollowSearchFansRequest {
    body: object;
}

export interface FollowUnblockRequest {
    id: string;
}

export interface FollowUnrestrictRequest {
    id: string;
}

/**
 * 
 */
export class FollowApi extends runtime.BaseAPI {

    /**
     * Blocks a follower
     */
    async followBlockRaw(requestParameters: FollowBlockRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling followBlock.');
        }

        if (requestParameters.body === null || requestParameters.body === undefined) {
            throw new runtime.RequiredError('body','Required parameter requestParameters.body was null or undefined when calling followBlock.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/follow/block/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Blocks a follower
     */
    async followBlock(requestParameters: FollowBlockRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.followBlockRaw(requestParameters, initOverrides);
    }

    /**
     * Creates a follow
     */
    async followCreateRaw(requestParameters: FollowCreateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<CreateFollowingRequestDto>> {
        if (requestParameters.createFollowingRequestDto === null || requestParameters.createFollowingRequestDto === undefined) {
            throw new runtime.RequiredError('createFollowingRequestDto','Required parameter requestParameters.createFollowingRequestDto was null or undefined when calling followCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/follow`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateFollowingRequestDtoToJSON(requestParameters.createFollowingRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateFollowingRequestDtoFromJSON(jsonValue));
    }

    /**
     * Creates a follow
     */
    async followCreate(requestParameters: FollowCreateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<CreateFollowingRequestDto> {
        const response = await this.followCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets a following
     */
    async followFindOneRaw(requestParameters: FollowFindOneRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<CreateFollowingRequestDto>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling followFindOne.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/follow/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateFollowingRequestDtoFromJSON(jsonValue));
    }

    /**
     * Gets a following
     */
    async followFindOne(requestParameters: FollowFindOneRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<CreateFollowingRequestDto> {
        const response = await this.followFindOneRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Deletes a following
     */
    async followRemoveRaw(requestParameters: FollowRemoveRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling followRemove.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/follow/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes a following
     */
    async followRemove(requestParameters: FollowRemoveRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.followRemoveRaw(requestParameters, initOverrides);
    }

    /**
     * Reports a follower
     */
    async followReportRaw(requestParameters: FollowReportRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling followReport.');
        }

        if (requestParameters.body === null || requestParameters.body === undefined) {
            throw new runtime.RequiredError('body','Required parameter requestParameters.body was null or undefined when calling followReport.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/follow/report/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Reports a follower
     */
    async followReport(requestParameters: FollowReportRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.followReportRaw(requestParameters, initOverrides);
    }

    /**
     * Restricts a follower
     */
    async followRestrictRaw(requestParameters: FollowRestrictRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling followRestrict.');
        }

        if (requestParameters.body === null || requestParameters.body === undefined) {
            throw new runtime.RequiredError('body','Required parameter requestParameters.body was null or undefined when calling followRestrict.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/follow/restrict/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Restricts a follower
     */
    async followRestrict(requestParameters: FollowRestrictRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.followRestrictRaw(requestParameters, initOverrides);
    }

    /**
     * Search for followers by query
     */
    async followSearchFansRaw(requestParameters: FollowSearchFansRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetFansResponseDto>> {
        if (requestParameters.body === null || requestParameters.body === undefined) {
            throw new runtime.RequiredError('body','Required parameter requestParameters.body was null or undefined when calling followSearchFans.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/follow/search`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetFansResponseDtoFromJSON(jsonValue));
    }

    /**
     * Search for followers by query
     */
    async followSearchFans(requestParameters: FollowSearchFansRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetFansResponseDto> {
        const response = await this.followSearchFansRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Unblocks a follower
     */
    async followUnblockRaw(requestParameters: FollowUnblockRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling followUnblock.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/follow/unblock/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Unblocks a follower
     */
    async followUnblock(requestParameters: FollowUnblockRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.followUnblockRaw(requestParameters, initOverrides);
    }

    /**
     * Unrestricts a follower
     */
    async followUnrestrictRaw(requestParameters: FollowUnrestrictRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling followUnrestrict.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/follow/unrestrict/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Unrestricts a follower
     */
    async followUnrestrict(requestParameters: FollowUnrestrictRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.followUnrestrictRaw(requestParameters, initOverrides);
    }

}

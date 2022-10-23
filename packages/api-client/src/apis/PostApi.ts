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
  BooleanResponseDto,
  CreatePostRequestDto,
  CreatePostResponseDto,
  GetPostHistoryRequestDto,
  GetPostHistoryResponseDto,
  GetPostResponseDto,
  GetPostsRequestDto,
  GetPostsResponseDto,
  PayinDataDto,
  PurchasePostRequestDto,
  RegisterPayinResponseDto,
  TipPostRequestDto,
  UpdatePostRequestDto,
} from '../models';
import {
    BooleanResponseDtoFromJSON,
    BooleanResponseDtoToJSON,
    CreatePostRequestDtoFromJSON,
    CreatePostRequestDtoToJSON,
    CreatePostResponseDtoFromJSON,
    CreatePostResponseDtoToJSON,
    GetPostHistoryRequestDtoFromJSON,
    GetPostHistoryRequestDtoToJSON,
    GetPostHistoryResponseDtoFromJSON,
    GetPostHistoryResponseDtoToJSON,
    GetPostResponseDtoFromJSON,
    GetPostResponseDtoToJSON,
    GetPostsRequestDtoFromJSON,
    GetPostsRequestDtoToJSON,
    GetPostsResponseDtoFromJSON,
    GetPostsResponseDtoToJSON,
    PayinDataDtoFromJSON,
    PayinDataDtoToJSON,
    PurchasePostRequestDtoFromJSON,
    PurchasePostRequestDtoToJSON,
    RegisterPayinResponseDtoFromJSON,
    RegisterPayinResponseDtoToJSON,
    TipPostRequestDtoFromJSON,
    TipPostRequestDtoToJSON,
    UpdatePostRequestDtoFromJSON,
    UpdatePostRequestDtoToJSON,
} from '../models';

export interface CreatePostRequest {
    createPostRequestDto: CreatePostRequestDto;
}

export interface FindPostRequest {
    postId: string;
}

export interface GetPostHistoryRequest {
    getPostHistoryRequestDto: GetPostHistoryRequestDto;
}

export interface GetPostsRequest {
    getPostsRequestDto: GetPostsRequestDto;
}

export interface PinPostRequest {
    postId: string;
}

export interface RegisterPurchasePostRequest {
    purchasePostRequestDto: PurchasePostRequestDto;
}

export interface RegisterPurchasePostDataRequest {
    purchasePostRequestDto: PurchasePostRequestDto;
}

export interface RegisterTipPostRequest {
    tipPostRequestDto: TipPostRequestDto;
}

export interface RemovePostRequest {
    postId: string;
}

export interface UnpinPostRequest {
    postId: string;
}

export interface UpdatePostRequest {
    postId: string;
    updatePostRequestDto: UpdatePostRequestDto;
}

/**
 * 
 */
export class PostApi extends runtime.BaseAPI {

    /**
     * Creates a post
     */
    async createPostRaw(requestParameters: CreatePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreatePostResponseDto>> {
        if (requestParameters.createPostRequestDto === null || requestParameters.createPostRequestDto === undefined) {
            throw new runtime.RequiredError('createPostRequestDto','Required parameter requestParameters.createPostRequestDto was null or undefined when calling createPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/post`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreatePostRequestDtoToJSON(requestParameters.createPostRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreatePostResponseDtoFromJSON(jsonValue));
    }

    /**
     * Creates a post
     */
    async createPost(requestParameters: CreatePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreatePostResponseDto> {
        const response = await this.createPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets a post
     */
    async findPostRaw(requestParameters: FindPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetPostResponseDto>> {
        if (requestParameters.postId === null || requestParameters.postId === undefined) {
            throw new runtime.RequiredError('postId','Required parameter requestParameters.postId was null or undefined when calling findPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/post/{postId}`.replace(`{${"postId"}}`, encodeURIComponent(String(requestParameters.postId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetPostResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets a post
     */
    async findPost(requestParameters: FindPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetPostResponseDto> {
        const response = await this.findPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get post history
     */
    async getPostHistoryRaw(requestParameters: GetPostHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetPostHistoryResponseDto>> {
        if (requestParameters.getPostHistoryRequestDto === null || requestParameters.getPostHistoryRequestDto === undefined) {
            throw new runtime.RequiredError('getPostHistoryRequestDto','Required parameter requestParameters.getPostHistoryRequestDto was null or undefined when calling getPostHistory.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/post/history`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GetPostHistoryRequestDtoToJSON(requestParameters.getPostHistoryRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetPostHistoryResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get post history
     */
    async getPostHistory(requestParameters: GetPostHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetPostHistoryResponseDto> {
        const response = await this.getPostHistoryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets posts
     */
    async getPostsRaw(requestParameters: GetPostsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetPostsResponseDto>> {
        if (requestParameters.getPostsRequestDto === null || requestParameters.getPostsRequestDto === undefined) {
            throw new runtime.RequiredError('getPostsRequestDto','Required parameter requestParameters.getPostsRequestDto was null or undefined when calling getPosts.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/post/posts`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GetPostsRequestDtoToJSON(requestParameters.getPostsRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetPostsResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets posts
     */
    async getPosts(requestParameters: GetPostsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetPostsResponseDto> {
        const response = await this.getPostsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Pin a post
     */
    async pinPostRaw(requestParameters: PinPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.postId === null || requestParameters.postId === undefined) {
            throw new runtime.RequiredError('postId','Required parameter requestParameters.postId was null or undefined when calling pinPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/post/pin/{postId}`.replace(`{${"postId"}}`, encodeURIComponent(String(requestParameters.postId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Pin a post
     */
    async pinPost(requestParameters: PinPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.pinPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Register purchase post payin
     */
    async registerPurchasePostRaw(requestParameters: RegisterPurchasePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RegisterPayinResponseDto>> {
        if (requestParameters.purchasePostRequestDto === null || requestParameters.purchasePostRequestDto === undefined) {
            throw new runtime.RequiredError('purchasePostRequestDto','Required parameter requestParameters.purchasePostRequestDto was null or undefined when calling registerPurchasePost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/post/pay/purchase`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PurchasePostRequestDtoToJSON(requestParameters.purchasePostRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RegisterPayinResponseDtoFromJSON(jsonValue));
    }

    /**
     * Register purchase post payin
     */
    async registerPurchasePost(requestParameters: RegisterPurchasePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RegisterPayinResponseDto> {
        const response = await this.registerPurchasePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get register purchase post data
     */
    async registerPurchasePostDataRaw(requestParameters: RegisterPurchasePostDataRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PayinDataDto>> {
        if (requestParameters.purchasePostRequestDto === null || requestParameters.purchasePostRequestDto === undefined) {
            throw new runtime.RequiredError('purchasePostRequestDto','Required parameter requestParameters.purchasePostRequestDto was null or undefined when calling registerPurchasePostData.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/post/pay/data/purchase`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PurchasePostRequestDtoToJSON(requestParameters.purchasePostRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PayinDataDtoFromJSON(jsonValue));
    }

    /**
     * Get register purchase post data
     */
    async registerPurchasePostData(requestParameters: RegisterPurchasePostDataRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PayinDataDto> {
        const response = await this.registerPurchasePostDataRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Register tip post payin
     */
    async registerTipPostRaw(requestParameters: RegisterTipPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RegisterPayinResponseDto>> {
        if (requestParameters.tipPostRequestDto === null || requestParameters.tipPostRequestDto === undefined) {
            throw new runtime.RequiredError('tipPostRequestDto','Required parameter requestParameters.tipPostRequestDto was null or undefined when calling registerTipPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/post/pay/tip`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TipPostRequestDtoToJSON(requestParameters.tipPostRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RegisterPayinResponseDtoFromJSON(jsonValue));
    }

    /**
     * Register tip post payin
     */
    async registerTipPost(requestParameters: RegisterTipPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RegisterPayinResponseDto> {
        const response = await this.registerTipPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Deletes a post
     */
    async removePostRaw(requestParameters: RemovePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.postId === null || requestParameters.postId === undefined) {
            throw new runtime.RequiredError('postId','Required parameter requestParameters.postId was null or undefined when calling removePost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/post/{postId}`.replace(`{${"postId"}}`, encodeURIComponent(String(requestParameters.postId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes a post
     */
    async removePost(requestParameters: RemovePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.removePostRaw(requestParameters, initOverrides);
    }

    /**
     * Unpin a post
     */
    async unpinPostRaw(requestParameters: UnpinPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.postId === null || requestParameters.postId === undefined) {
            throw new runtime.RequiredError('postId','Required parameter requestParameters.postId was null or undefined when calling unpinPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/post/unpin/{postId}`.replace(`{${"postId"}}`, encodeURIComponent(String(requestParameters.postId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Unpin a post
     */
    async unpinPost(requestParameters: UnpinPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.unpinPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Updates a post
     */
    async updatePostRaw(requestParameters: UpdatePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.postId === null || requestParameters.postId === undefined) {
            throw new runtime.RequiredError('postId','Required parameter requestParameters.postId was null or undefined when calling updatePost.');
        }

        if (requestParameters.updatePostRequestDto === null || requestParameters.updatePostRequestDto === undefined) {
            throw new runtime.RequiredError('updatePostRequestDto','Required parameter requestParameters.updatePostRequestDto was null or undefined when calling updatePost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/post/{postId}`.replace(`{${"postId"}}`, encodeURIComponent(String(requestParameters.postId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdatePostRequestDtoToJSON(requestParameters.updatePostRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Updates a post
     */
    async updatePost(requestParameters: UpdatePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.updatePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

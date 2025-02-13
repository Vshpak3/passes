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
  CreateCommentRequestDto,
  CreateCommentResponseDto,
  GetCommentsForPostRequestDto,
  GetCommentsForPostResponseDto,
} from '../models';
import {
    BooleanResponseDtoFromJSON,
    BooleanResponseDtoToJSON,
    CreateCommentRequestDtoFromJSON,
    CreateCommentRequestDtoToJSON,
    CreateCommentResponseDtoFromJSON,
    CreateCommentResponseDtoToJSON,
    GetCommentsForPostRequestDtoFromJSON,
    GetCommentsForPostRequestDtoToJSON,
    GetCommentsForPostResponseDtoFromJSON,
    GetCommentsForPostResponseDtoToJSON,
} from '../models';

export interface CreateCommentRequest {
    createCommentRequestDto: CreateCommentRequestDto;
}

export interface DeleteCommentRequest {
    postId: string;
    commentId: string;
}

export interface FindCommentsForPostRequest {
    getCommentsForPostRequestDto: GetCommentsForPostRequestDto;
}

export interface HideCommentRequest {
    postId: string;
    commentId: string;
}

export interface UnhideCommentRequest {
    postId: string;
    commentId: string;
}

/**
 * 
 */
export class CommentApi extends runtime.BaseAPI {

    /**
     * Creates a comment
     */
    async createCommentRaw(requestParameters: CreateCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreateCommentResponseDto>> {
        if (requestParameters.createCommentRequestDto === null || requestParameters.createCommentRequestDto === undefined) {
            throw new runtime.RequiredError('createCommentRequestDto','Required parameter requestParameters.createCommentRequestDto was null or undefined when calling createComment.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/comment`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateCommentRequestDtoToJSON(requestParameters.createCommentRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreateCommentResponseDtoFromJSON(jsonValue));
    }

    /**
     * Creates a comment
     */
    async createComment(requestParameters: CreateCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreateCommentResponseDto> {
        const response = await this.createCommentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Deletes a comment
     */
    async deleteCommentRaw(requestParameters: DeleteCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.postId === null || requestParameters.postId === undefined) {
            throw new runtime.RequiredError('postId','Required parameter requestParameters.postId was null or undefined when calling deleteComment.');
        }

        if (requestParameters.commentId === null || requestParameters.commentId === undefined) {
            throw new runtime.RequiredError('commentId','Required parameter requestParameters.commentId was null or undefined when calling deleteComment.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/comment/delete/{postId}/{commentId}`.replace(`{${"postId"}}`, encodeURIComponent(String(requestParameters.postId))).replace(`{${"commentId"}}`, encodeURIComponent(String(requestParameters.commentId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Deletes a comment
     */
    async deleteComment(requestParameters: DeleteCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.deleteCommentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets all comments for a post
     */
    async findCommentsForPostRaw(requestParameters: FindCommentsForPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCommentsForPostResponseDto>> {
        if (requestParameters.getCommentsForPostRequestDto === null || requestParameters.getCommentsForPostRequestDto === undefined) {
            throw new runtime.RequiredError('getCommentsForPostRequestDto','Required parameter requestParameters.getCommentsForPostRequestDto was null or undefined when calling findCommentsForPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        /* No auth for endpoint but always send access token */
        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/comment/post`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GetCommentsForPostRequestDtoToJSON(requestParameters.getCommentsForPostRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCommentsForPostResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets all comments for a post
     */
    async findCommentsForPost(requestParameters: FindCommentsForPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCommentsForPostResponseDto> {
        const response = await this.findCommentsForPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Hides a comment
     */
    async hideCommentRaw(requestParameters: HideCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.postId === null || requestParameters.postId === undefined) {
            throw new runtime.RequiredError('postId','Required parameter requestParameters.postId was null or undefined when calling hideComment.');
        }

        if (requestParameters.commentId === null || requestParameters.commentId === undefined) {
            throw new runtime.RequiredError('commentId','Required parameter requestParameters.commentId was null or undefined when calling hideComment.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/comment/hide/{postId}/{commentId}`.replace(`{${"postId"}}`, encodeURIComponent(String(requestParameters.postId))).replace(`{${"commentId"}}`, encodeURIComponent(String(requestParameters.commentId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Hides a comment
     */
    async hideComment(requestParameters: HideCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.hideCommentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Unhides a comment
     */
    async unhideCommentRaw(requestParameters: UnhideCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.postId === null || requestParameters.postId === undefined) {
            throw new runtime.RequiredError('postId','Required parameter requestParameters.postId was null or undefined when calling unhideComment.');
        }

        if (requestParameters.commentId === null || requestParameters.commentId === undefined) {
            throw new runtime.RequiredError('commentId','Required parameter requestParameters.commentId was null or undefined when calling unhideComment.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/comment/unhide/{postId}/{commentId}`.replace(`{${"postId"}}`, encodeURIComponent(String(requestParameters.postId))).replace(`{${"commentId"}}`, encodeURIComponent(String(requestParameters.commentId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Unhides a comment
     */
    async unhideComment(requestParameters: UnhideCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.unhideCommentRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

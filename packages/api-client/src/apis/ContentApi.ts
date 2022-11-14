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
  CreateContentRequestDto,
  DeleteContentRequestDto,
  GetSignedUrlResponseDto,
  GetVaultQueryRequestDto,
  GetVaultQueryResponseDto,
  MarkProcessedProfileImageRequestDto,
  MarkProcessedUserContentRequestDto,
  MarkUploadedRequestDto,
  PresignPassRequestDto,
} from '../models';
import {
    BooleanResponseDtoFromJSON,
    BooleanResponseDtoToJSON,
    CreateContentRequestDtoFromJSON,
    CreateContentRequestDtoToJSON,
    DeleteContentRequestDtoFromJSON,
    DeleteContentRequestDtoToJSON,
    GetSignedUrlResponseDtoFromJSON,
    GetSignedUrlResponseDtoToJSON,
    GetVaultQueryRequestDtoFromJSON,
    GetVaultQueryRequestDtoToJSON,
    GetVaultQueryResponseDtoFromJSON,
    GetVaultQueryResponseDtoToJSON,
    MarkProcessedProfileImageRequestDtoFromJSON,
    MarkProcessedProfileImageRequestDtoToJSON,
    MarkProcessedUserContentRequestDtoFromJSON,
    MarkProcessedUserContentRequestDtoToJSON,
    MarkUploadedRequestDtoFromJSON,
    MarkUploadedRequestDtoToJSON,
    PresignPassRequestDtoFromJSON,
    PresignPassRequestDtoToJSON,
} from '../models';

export interface DeleteContentRequest {
    deleteContentRequestDto: DeleteContentRequestDto;
}

export interface GetVaultContentRequest {
    getVaultQueryRequestDto: GetVaultQueryRequestDto;
}

export interface MarkProfileImageProcessedRequest {
    markProcessedProfileImageRequestDto: MarkProcessedProfileImageRequestDto;
}

export interface MarkUploadedRequest {
    markUploadedRequestDto: MarkUploadedRequestDto;
}

export interface MarkUserContentProcessedRequest {
    markProcessedUserContentRequestDto: MarkProcessedUserContentRequestDto;
}

export interface PreSignContentRequest {
    createContentRequestDto: CreateContentRequestDto;
}

export interface PreSignPassRequest {
    presignPassRequestDto: PresignPassRequestDto;
}

/**
 * 
 */
export class ContentApi extends runtime.BaseAPI {

    /**
     * Delete content
     */
    async deleteContentRaw(requestParameters: DeleteContentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.deleteContentRequestDto === null || requestParameters.deleteContentRequestDto === undefined) {
            throw new runtime.RequiredError('deleteContentRequestDto','Required parameter requestParameters.deleteContentRequestDto was null or undefined when calling deleteContent.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/content`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
            body: DeleteContentRequestDtoToJSON(requestParameters.deleteContentRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Delete content
     */
    async deleteContent(requestParameters: DeleteContentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.deleteContentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete profile banner
     */
    async deleteProfileBannerRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/content/profile-banner`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete profile banner
     */
    async deleteProfileBanner(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteProfileBannerRaw(initOverrides);
    }

    /**
     * Gets all content associated with the current authenticated user
     */
    async getVaultContentRaw(requestParameters: GetVaultContentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetVaultQueryResponseDto>> {
        if (requestParameters.getVaultQueryRequestDto === null || requestParameters.getVaultQueryRequestDto === undefined) {
            throw new runtime.RequiredError('getVaultQueryRequestDto','Required parameter requestParameters.getVaultQueryRequestDto was null or undefined when calling getVaultContent.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/content/vault`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GetVaultQueryRequestDtoToJSON(requestParameters.getVaultQueryRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetVaultQueryResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets all content associated with the current authenticated user
     */
    async getVaultContent(requestParameters: GetVaultContentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetVaultQueryResponseDto> {
        const response = await this.getVaultContentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Mark profile image as processed
     */
    async markProfileImageProcessedRaw(requestParameters: MarkProfileImageProcessedRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.markProcessedProfileImageRequestDto === null || requestParameters.markProcessedProfileImageRequestDto === undefined) {
            throw new runtime.RequiredError('markProcessedProfileImageRequestDto','Required parameter requestParameters.markProcessedProfileImageRequestDto was null or undefined when calling markProfileImageProcessed.');
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
            path: `/api/content/processed/profile`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: MarkProcessedProfileImageRequestDtoToJSON(requestParameters.markProcessedProfileImageRequestDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Mark profile image as processed
     */
    async markProfileImageProcessed(requestParameters: MarkProfileImageProcessedRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.markProfileImageProcessedRaw(requestParameters, initOverrides);
    }

    /**
     * Mark uploaded
     */
    async markUploadedRaw(requestParameters: MarkUploadedRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.markUploadedRequestDto === null || requestParameters.markUploadedRequestDto === undefined) {
            throw new runtime.RequiredError('markUploadedRequestDto','Required parameter requestParameters.markUploadedRequestDto was null or undefined when calling markUploaded.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/content/uploaded`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: MarkUploadedRequestDtoToJSON(requestParameters.markUploadedRequestDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Mark uploaded
     */
    async markUploaded(requestParameters: MarkUploadedRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.markUploadedRaw(requestParameters, initOverrides);
    }

    /**
     * Mark user content as processed
     */
    async markUserContentProcessedRaw(requestParameters: MarkUserContentProcessedRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.markProcessedUserContentRequestDto === null || requestParameters.markProcessedUserContentRequestDto === undefined) {
            throw new runtime.RequiredError('markProcessedUserContentRequestDto','Required parameter requestParameters.markProcessedUserContentRequestDto was null or undefined when calling markUserContentProcessed.');
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
            path: `/api/content/processed/usercontent`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: MarkProcessedUserContentRequestDtoToJSON(requestParameters.markProcessedUserContentRequestDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Mark user content as processed
     */
    async markUserContentProcessed(requestParameters: MarkUserContentProcessedRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.markUserContentProcessedRaw(requestParameters, initOverrides);
    }

    /**
     * Get signed url for content
     */
    async preSignContentRaw(requestParameters: PreSignContentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetSignedUrlResponseDto>> {
        if (requestParameters.createContentRequestDto === null || requestParameters.createContentRequestDto === undefined) {
            throw new runtime.RequiredError('createContentRequestDto','Required parameter requestParameters.createContentRequestDto was null or undefined when calling preSignContent.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/content/sign/content`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateContentRequestDtoToJSON(requestParameters.createContentRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetSignedUrlResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get signed url for content
     */
    async preSignContent(requestParameters: PreSignContentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetSignedUrlResponseDto> {
        const response = await this.preSignContentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get pre signed url for pass image
     */
    async preSignPassRaw(requestParameters: PreSignPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetSignedUrlResponseDto>> {
        if (requestParameters.presignPassRequestDto === null || requestParameters.presignPassRequestDto === undefined) {
            throw new runtime.RequiredError('presignPassRequestDto','Required parameter requestParameters.presignPassRequestDto was null or undefined when calling preSignPass.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/content/sign/pass`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PresignPassRequestDtoToJSON(requestParameters.presignPassRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetSignedUrlResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get pre signed url for pass image
     */
    async preSignPass(requestParameters: PreSignPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetSignedUrlResponseDto> {
        const response = await this.preSignPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get pre signed url for profile banner
     */
    async preSignProfileBannerRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetSignedUrlResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/content/sign/profile/banner`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetSignedUrlResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get pre signed url for profile banner
     */
    async preSignProfileBanner(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetSignedUrlResponseDto> {
        const response = await this.preSignProfileBannerRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get pre signed url for profile image
     */
    async preSignProfileImageRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetSignedUrlResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/content/sign/profile/image`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetSignedUrlResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get pre signed url for profile image
     */
    async preSignProfileImage(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetSignedUrlResponseDto> {
        const response = await this.preSignProfileImageRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get signed url for W-9 form
     */
    async preSignW9Raw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetSignedUrlResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
        }

        const response = await this.request({
            path: `/api/content/sign/w9`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetSignedUrlResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get signed url for W-9 form
     */
    async preSignW9(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetSignedUrlResponseDto> {
        const response = await this.preSignW9Raw(initOverrides);
        return await response.value();
    }

}

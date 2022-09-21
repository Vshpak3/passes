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

export interface LikePostRequest {
    postId: string;
}

export interface UnlikePostRequest {
    postId: string;
}

/**
 * 
 */
export class LikeApi extends runtime.BaseAPI {

    /**
     * Creates a like on a post
     */
    async likePostRaw(requestParameters: LikePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.postId === null || requestParameters.postId === undefined) {
            throw new runtime.RequiredError('postId','Required parameter requestParameters.postId was null or undefined when calling likePost.');
        }

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
            path: `/api/like/{postId}`.replace(`{${"postId"}}`, encodeURIComponent(String(requestParameters.postId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Creates a like on a post
     */
    async likePost(requestParameters: LikePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.likePostRaw(requestParameters, initOverrides);
    }

    /**
     * Removes a like on a post
     */
    async unlikePostRaw(requestParameters: UnlikePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.postId === null || requestParameters.postId === undefined) {
            throw new runtime.RequiredError('postId','Required parameter requestParameters.postId was null or undefined when calling unlikePost.');
        }

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
            path: `/api/like/{postId}`.replace(`{${"postId"}}`, encodeURIComponent(String(requestParameters.postId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Removes a like on a post
     */
    async unlikePost(requestParameters: UnlikePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.unlikePostRaw(requestParameters, initOverrides);
    }

}

export const LikeSecurityInfo = new Set<string>([
    "likePost",
    "unlikePost",
])

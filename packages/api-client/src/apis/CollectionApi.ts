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
    GetCollectionResponseDto,
    GetCollectionResponseDtoFromJSON,
    GetCollectionResponseDtoToJSON,
    UpdateCollectionRequestDto,
    UpdateCollectionRequestDtoFromJSON,
    UpdateCollectionRequestDtoToJSON,
} from '../models';

export interface CollectionCreateRequest {
    body: object;
}

export interface CollectionFindByCreatorUsernameRequest {
    username: string;
}

export interface CollectionFindOneRequest {
    id: string;
}

export interface CollectionUpdateRequest {
    id: string;
    updateCollectionRequestDto: UpdateCollectionRequestDto;
}

/**
 * 
 */
export class CollectionApi extends runtime.BaseAPI {

    /**
     * Creates a collection
     */
    async collectionCreateRaw(requestParameters: CollectionCreateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetCollectionResponseDto>> {
        if (requestParameters.body === null || requestParameters.body === undefined) {
            throw new runtime.RequiredError('body','Required parameter requestParameters.body was null or undefined when calling collectionCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/collection`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCollectionResponseDtoFromJSON(jsonValue));
    }

    /**
     * Creates a collection
     */
    async collectionCreate(requestParameters: CollectionCreateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetCollectionResponseDto> {
        const response = await this.collectionCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets a collection by creator username
     */
    async collectionFindByCreatorUsernameRaw(requestParameters: CollectionFindByCreatorUsernameRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetCollectionResponseDto>> {
        if (requestParameters.username === null || requestParameters.username === undefined) {
            throw new runtime.RequiredError('username','Required parameter requestParameters.username was null or undefined when calling collectionFindByCreatorUsername.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/collection/creator/{username}`.replace(`{${"username"}}`, encodeURIComponent(String(requestParameters.username))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCollectionResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets a collection by creator username
     */
    async collectionFindByCreatorUsername(requestParameters: CollectionFindByCreatorUsernameRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetCollectionResponseDto> {
        const response = await this.collectionFindByCreatorUsernameRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets a collection
     */
    async collectionFindOneRaw(requestParameters: CollectionFindOneRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetCollectionResponseDto>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling collectionFindOne.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/collection/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCollectionResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets a collection
     */
    async collectionFindOne(requestParameters: CollectionFindOneRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetCollectionResponseDto> {
        const response = await this.collectionFindOneRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Updates a collection
     */
    async collectionUpdateRaw(requestParameters: CollectionUpdateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetCollectionResponseDto>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling collectionUpdate.');
        }

        if (requestParameters.updateCollectionRequestDto === null || requestParameters.updateCollectionRequestDto === undefined) {
            throw new runtime.RequiredError('updateCollectionRequestDto','Required parameter requestParameters.updateCollectionRequestDto was null or undefined when calling collectionUpdate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/collection/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateCollectionRequestDtoToJSON(requestParameters.updateCollectionRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCollectionResponseDtoFromJSON(jsonValue));
    }

    /**
     * Updates a collection
     */
    async collectionUpdate(requestParameters: CollectionUpdateRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetCollectionResponseDto> {
        const response = await this.collectionUpdateRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

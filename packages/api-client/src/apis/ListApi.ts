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
    CreateListRequestDto,
    CreateListRequestDtoFromJSON,
    CreateListRequestDtoToJSON,
    GetListMembersRequestto,
    GetListMembersRequesttoFromJSON,
    GetListMembersRequesttoToJSON,
    GetListMembersResponseDto,
    GetListMembersResponseDtoFromJSON,
    GetListMembersResponseDtoToJSON,
    GetListResponseDto,
    GetListResponseDtoFromJSON,
    GetListResponseDtoToJSON,
    GetListsResponseDto,
    GetListsResponseDtoFromJSON,
    GetListsResponseDtoToJSON,
    RemoveListMembersRequestDto,
    RemoveListMembersRequestDtoFromJSON,
    RemoveListMembersRequestDtoToJSON,
} from '../models';

export interface CreateListRequest {
    createListRequestDto: CreateListRequestDto;
}

export interface DeleteListRequest {
    listId: string;
}

export interface GetListRequest {
    listId: string;
}

export interface GetListMembersRequest {
    getListMembersRequestto: GetListMembersRequestto;
}

export interface RemoveListMembersRequest {
    removeListMembersRequestDto: RemoveListMembersRequestDto;
}

/**
 * 
 */
export class ListApi extends runtime.BaseAPI {

    /**
     * Creates List for a user
     */
    async createListRaw(requestParameters: CreateListRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.createListRequestDto === null || requestParameters.createListRequestDto === undefined) {
            throw new runtime.RequiredError('createListRequestDto','Required parameter requestParameters.createListRequestDto was null or undefined when calling createList.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/list`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateListRequestDtoToJSON(requestParameters.createListRequestDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Creates List for a user
     */
    async createList(requestParameters: CreateListRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.createListRaw(requestParameters, initOverrides);
    }

    /**
     * Delete list for user
     */
    async deleteListRaw(requestParameters: DeleteListRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.listId === null || requestParameters.listId === undefined) {
            throw new runtime.RequiredError('listId','Required parameter requestParameters.listId was null or undefined when calling deleteList.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/list/{listId}`.replace(`{${"listId"}}`, encodeURIComponent(String(requestParameters.listId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Delete list for user
     */
    async deleteList(requestParameters: DeleteListRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<boolean> {
        const response = await this.deleteListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get list for user
     */
    async getListRaw(requestParameters: GetListRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetListResponseDto>> {
        if (requestParameters.listId === null || requestParameters.listId === undefined) {
            throw new runtime.RequiredError('listId','Required parameter requestParameters.listId was null or undefined when calling getList.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/list/{listId}`.replace(`{${"listId"}}`, encodeURIComponent(String(requestParameters.listId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetListResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get list for user
     */
    async getList(requestParameters: GetListRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetListResponseDto> {
        const response = await this.getListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get list members for user
     */
    async getListMembersRaw(requestParameters: GetListMembersRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetListMembersResponseDto>> {
        if (requestParameters.getListMembersRequestto === null || requestParameters.getListMembersRequestto === undefined) {
            throw new runtime.RequiredError('getListMembersRequestto','Required parameter requestParameters.getListMembersRequestto was null or undefined when calling getListMembers.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/list/members`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GetListMembersRequesttoToJSON(requestParameters.getListMembersRequestto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetListMembersResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get list members for user
     */
    async getListMembers(requestParameters: GetListMembersRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetListMembersResponseDto> {
        const response = await this.getListMembersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get all lists for user
     */
    async getListsRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetListsResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/list`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetListsResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get all lists for user
     */
    async getLists(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetListsResponseDto> {
        const response = await this.getListsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Remove ListMembers from a List
     */
    async removeListMembersRaw(requestParameters: RemoveListMembersRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.removeListMembersRequestDto === null || requestParameters.removeListMembersRequestDto === undefined) {
            throw new runtime.RequiredError('removeListMembersRequestDto','Required parameter requestParameters.removeListMembersRequestDto was null or undefined when calling removeListMembers.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/list/members`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
            body: RemoveListMembersRequestDtoToJSON(requestParameters.removeListMembersRequestDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Remove ListMembers from a List
     */
    async removeListMembers(requestParameters: RemoveListMembersRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.removeListMembersRaw(requestParameters, initOverrides);
    }

}

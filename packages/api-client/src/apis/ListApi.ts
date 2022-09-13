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
  AddListMembersRequestDto,
  CreateListRequestDto,
  EditListNameRequestDto,
  GetListMembersRequestDto,
  GetListMembersResponseDto,
  GetListResponseDto,
  GetListsResponseDto,
  RemoveListMembersRequestDto,
} from '../models';
import {
    AddListMembersRequestDtoFromJSON,
    AddListMembersRequestDtoToJSON,
    CreateListRequestDtoFromJSON,
    CreateListRequestDtoToJSON,
    EditListNameRequestDtoFromJSON,
    EditListNameRequestDtoToJSON,
    GetListMembersRequestDtoFromJSON,
    GetListMembersRequestDtoToJSON,
    GetListMembersResponseDtoFromJSON,
    GetListMembersResponseDtoToJSON,
    GetListResponseDtoFromJSON,
    GetListResponseDtoToJSON,
    GetListsResponseDtoFromJSON,
    GetListsResponseDtoToJSON,
    RemoveListMembersRequestDtoFromJSON,
    RemoveListMembersRequestDtoToJSON,
} from '../models';

export interface AddListMembersRequest {
    addListMembersRequestDto: AddListMembersRequestDto;
}

export interface CreateListRequest {
    createListRequestDto: CreateListRequestDto;
}

export interface DeleteListRequest {
    listId: string;
}

export interface EditListNameRequest {
    editListNameRequestDto: EditListNameRequestDto;
}

export interface GetListRequest {
    listId: string;
}

export interface GetListMembersRequest {
    getListMembersRequestDto: GetListMembersRequestDto;
}

export interface RemoveListMembersRequest {
    removeListMembersRequestDto: RemoveListMembersRequestDto;
}

/**
 * 
 */
export class ListApi extends runtime.BaseAPI {

    /**
     * Add ListMembers to a List
     */
    async addListMembersRaw(requestParameters: AddListMembersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.addListMembersRequestDto === null || requestParameters.addListMembersRequestDto === undefined) {
            throw new runtime.RequiredError('addListMembersRequestDto','Required parameter requestParameters.addListMembersRequestDto was null or undefined when calling addListMembers.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/list/add-members`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddListMembersRequestDtoToJSON(requestParameters.addListMembersRequestDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Add ListMembers to a List
     */
    async addListMembers(requestParameters: AddListMembersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.addListMembersRaw(requestParameters, initOverrides);
    }

    /**
     * Creates List for a user
     */
    async createListRaw(requestParameters: CreateListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.createListRequestDto === null || requestParameters.createListRequestDto === undefined) {
            throw new runtime.RequiredError('createListRequestDto','Required parameter requestParameters.createListRequestDto was null or undefined when calling createList.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/list/create`,
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
    async createList(requestParameters: CreateListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.createListRaw(requestParameters, initOverrides);
    }

    /**
     * Delete list for user
     */
    async deleteListRaw(requestParameters: DeleteListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.listId === null || requestParameters.listId === undefined) {
            throw new runtime.RequiredError('listId','Required parameter requestParameters.listId was null or undefined when calling deleteList.');
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
            path: `/api/list/list-info/{listId}`.replace(`{${"listId"}}`, encodeURIComponent(String(requestParameters.listId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Delete list for user
     */
    async deleteList(requestParameters: DeleteListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<boolean> {
        const response = await this.deleteListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Edit list name
     */
    async editListNameRaw(requestParameters: EditListNameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.editListNameRequestDto === null || requestParameters.editListNameRequestDto === undefined) {
            throw new runtime.RequiredError('editListNameRequestDto','Required parameter requestParameters.editListNameRequestDto was null or undefined when calling editListName.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/list/list-info`,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: EditListNameRequestDtoToJSON(requestParameters.editListNameRequestDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Edit list name
     */
    async editListName(requestParameters: EditListNameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<boolean> {
        const response = await this.editListNameRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get list for user
     */
    async getListRaw(requestParameters: GetListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetListResponseDto>> {
        if (requestParameters.listId === null || requestParameters.listId === undefined) {
            throw new runtime.RequiredError('listId','Required parameter requestParameters.listId was null or undefined when calling getList.');
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
            path: `/api/list/list-info/{listId}`.replace(`{${"listId"}}`, encodeURIComponent(String(requestParameters.listId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetListResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get list for user
     */
    async getList(requestParameters: GetListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetListResponseDto> {
        const response = await this.getListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get list members for user
     */
    async getListMembersRaw(requestParameters: GetListMembersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetListMembersResponseDto>> {
        if (requestParameters.getListMembersRequestDto === null || requestParameters.getListMembersRequestDto === undefined) {
            throw new runtime.RequiredError('getListMembersRequestDto','Required parameter requestParameters.getListMembersRequestDto was null or undefined when calling getListMembers.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/list/members`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GetListMembersRequestDtoToJSON(requestParameters.getListMembersRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetListMembersResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get list members for user
     */
    async getListMembers(requestParameters: GetListMembersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetListMembersResponseDto> {
        const response = await this.getListMembersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get all lists for user
     */
    async getListsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetListsResponseDto>> {
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
            path: `/api/list/lists-info`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetListsResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get all lists for user
     */
    async getLists(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetListsResponseDto> {
        const response = await this.getListsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Remove ListMembers from a List
     */
    async removeListMembersRaw(requestParameters: RemoveListMembersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.removeListMembersRequestDto === null || requestParameters.removeListMembersRequestDto === undefined) {
            throw new runtime.RequiredError('removeListMembersRequestDto','Required parameter requestParameters.removeListMembersRequestDto was null or undefined when calling removeListMembers.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
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
    async removeListMembers(requestParameters: RemoveListMembersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.removeListMembersRaw(requestParameters, initOverrides);
    }

}

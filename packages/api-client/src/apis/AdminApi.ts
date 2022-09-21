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
  AccessTokensResponseDto,
  AddExternalPassAddressRequestDto,
  AdminDto,
  CreateExternalPassRequestDto,
  DeleteExternalPassAddressRequestDto,
  GetCreatorFeeRequestDto,
  GetCreatorFeeResponseDto,
  ImpersonateUserRequestDto,
  SetCreatorFeeRequestDto,
  UpdateExternalPassRequestDto,
  UserExternalPassRequestDto,
} from '../models';
import {
    AccessTokensResponseDtoFromJSON,
    AccessTokensResponseDtoToJSON,
    AddExternalPassAddressRequestDtoFromJSON,
    AddExternalPassAddressRequestDtoToJSON,
    AdminDtoFromJSON,
    AdminDtoToJSON,
    CreateExternalPassRequestDtoFromJSON,
    CreateExternalPassRequestDtoToJSON,
    DeleteExternalPassAddressRequestDtoFromJSON,
    DeleteExternalPassAddressRequestDtoToJSON,
    GetCreatorFeeRequestDtoFromJSON,
    GetCreatorFeeRequestDtoToJSON,
    GetCreatorFeeResponseDtoFromJSON,
    GetCreatorFeeResponseDtoToJSON,
    ImpersonateUserRequestDtoFromJSON,
    ImpersonateUserRequestDtoToJSON,
    SetCreatorFeeRequestDtoFromJSON,
    SetCreatorFeeRequestDtoToJSON,
    UpdateExternalPassRequestDtoFromJSON,
    UpdateExternalPassRequestDtoToJSON,
    UserExternalPassRequestDtoFromJSON,
    UserExternalPassRequestDtoToJSON,
} from '../models';

export interface AddExternalPassRequest {
    createExternalPassRequestDto: CreateExternalPassRequestDto;
}

export interface AddExternalPassAddressRequest {
    addExternalPassAddressRequestDto: AddExternalPassAddressRequestDto;
}

export interface AddUserExternalPassRequest {
    userExternalPassRequestDto: UserExternalPassRequestDto;
}

export interface DeleteExternalPassRequest {
    updateExternalPassRequestDto: UpdateExternalPassRequestDto;
}

export interface DeleteExternalPassAddressRequest {
    deleteExternalPassAddressRequestDto: DeleteExternalPassAddressRequestDto;
}

export interface DeleteUserExternalPassRequest {
    userExternalPassRequestDto: UserExternalPassRequestDto;
}

export interface FlagAsAdultRequest {
    adminDto: AdminDto;
}

export interface GetCreatorFeeRequest {
    getCreatorFeeRequestDto: GetCreatorFeeRequestDto;
}

export interface ImpersonateUserRequest {
    impersonateUserRequestDto: ImpersonateUserRequestDto;
}

export interface SetCreatorFeeRequest {
    setCreatorFeeRequestDto: SetCreatorFeeRequestDto;
}

export interface UpdateExternalPassRequest {
    updateExternalPassRequestDto: UpdateExternalPassRequestDto;
}

/**
 * 
 */
export class AdminApi extends runtime.BaseAPI {

    /**
     * Add external pass
     */
    async addExternalPassRaw(requestParameters: AddExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.createExternalPassRequestDto === null || requestParameters.createExternalPassRequestDto === undefined) {
            throw new runtime.RequiredError('createExternalPassRequestDto','Required parameter requestParameters.createExternalPassRequestDto was null or undefined when calling addExternalPass.');
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
            path: `/api/admin/external-pass/add`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateExternalPassRequestDtoToJSON(requestParameters.createExternalPassRequestDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Add external pass
     */
    async addExternalPass(requestParameters: AddExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<boolean> {
        const response = await this.addExternalPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Add external pass address
     */
    async addExternalPassAddressRaw(requestParameters: AddExternalPassAddressRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.addExternalPassAddressRequestDto === null || requestParameters.addExternalPassAddressRequestDto === undefined) {
            throw new runtime.RequiredError('addExternalPassAddressRequestDto','Required parameter requestParameters.addExternalPassAddressRequestDto was null or undefined when calling addExternalPassAddress.');
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
            path: `/api/admin/external-pass/address/add`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddExternalPassAddressRequestDtoToJSON(requestParameters.addExternalPassAddressRequestDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Add external pass address
     */
    async addExternalPassAddress(requestParameters: AddExternalPassAddressRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<boolean> {
        const response = await this.addExternalPassAddressRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Add external pass for user
     */
    async addUserExternalPassRaw(requestParameters: AddUserExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.userExternalPassRequestDto === null || requestParameters.userExternalPassRequestDto === undefined) {
            throw new runtime.RequiredError('userExternalPassRequestDto','Required parameter requestParameters.userExternalPassRequestDto was null or undefined when calling addUserExternalPass.');
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
            path: `/api/admin/external-pass/user/add`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserExternalPassRequestDtoToJSON(requestParameters.userExternalPassRequestDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Add external pass for user
     */
    async addUserExternalPass(requestParameters: AddUserExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<boolean> {
        const response = await this.addUserExternalPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete external pass
     */
    async deleteExternalPassRaw(requestParameters: DeleteExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.updateExternalPassRequestDto === null || requestParameters.updateExternalPassRequestDto === undefined) {
            throw new runtime.RequiredError('updateExternalPassRequestDto','Required parameter requestParameters.updateExternalPassRequestDto was null or undefined when calling deleteExternalPass.');
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
            path: `/api/admin/external-pass/delete`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateExternalPassRequestDtoToJSON(requestParameters.updateExternalPassRequestDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Delete external pass
     */
    async deleteExternalPass(requestParameters: DeleteExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<boolean> {
        const response = await this.deleteExternalPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete external pass address
     */
    async deleteExternalPassAddressRaw(requestParameters: DeleteExternalPassAddressRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.deleteExternalPassAddressRequestDto === null || requestParameters.deleteExternalPassAddressRequestDto === undefined) {
            throw new runtime.RequiredError('deleteExternalPassAddressRequestDto','Required parameter requestParameters.deleteExternalPassAddressRequestDto was null or undefined when calling deleteExternalPassAddress.');
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
            path: `/api/admin/external-pass/address/delete`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DeleteExternalPassAddressRequestDtoToJSON(requestParameters.deleteExternalPassAddressRequestDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Delete external pass address
     */
    async deleteExternalPassAddress(requestParameters: DeleteExternalPassAddressRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<boolean> {
        const response = await this.deleteExternalPassAddressRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete external pass for user
     */
    async deleteUserExternalPassRaw(requestParameters: DeleteUserExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.userExternalPassRequestDto === null || requestParameters.userExternalPassRequestDto === undefined) {
            throw new runtime.RequiredError('userExternalPassRequestDto','Required parameter requestParameters.userExternalPassRequestDto was null or undefined when calling deleteUserExternalPass.');
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
            path: `/api/admin/external-pass/user/delete`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserExternalPassRequestDtoToJSON(requestParameters.userExternalPassRequestDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Delete external pass for user
     */
    async deleteUserExternalPass(requestParameters: DeleteUserExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<boolean> {
        const response = await this.deleteUserExternalPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Flags user as adult
     */
    async flagAsAdultRaw(requestParameters: FlagAsAdultRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.adminDto === null || requestParameters.adminDto === undefined) {
            throw new runtime.RequiredError('adminDto','Required parameter requestParameters.adminDto was null or undefined when calling flagAsAdult.');
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
            path: `/api/admin/adult`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AdminDtoToJSON(requestParameters.adminDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Flags user as adult
     */
    async flagAsAdult(requestParameters: FlagAsAdultRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.flagAsAdultRaw(requestParameters, initOverrides);
    }

    /**
     * Get creator fee
     */
    async getCreatorFeeRaw(requestParameters: GetCreatorFeeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetCreatorFeeResponseDto>> {
        if (requestParameters.getCreatorFeeRequestDto === null || requestParameters.getCreatorFeeRequestDto === undefined) {
            throw new runtime.RequiredError('getCreatorFeeRequestDto','Required parameter requestParameters.getCreatorFeeRequestDto was null or undefined when calling getCreatorFee.');
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
            path: `/api/admin/creator-fee/get`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GetCreatorFeeRequestDtoToJSON(requestParameters.getCreatorFeeRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetCreatorFeeResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get creator fee
     */
    async getCreatorFee(requestParameters: GetCreatorFeeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetCreatorFeeResponseDto> {
        const response = await this.getCreatorFeeRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Impersonates a user
     */
    async impersonateUserRaw(requestParameters: ImpersonateUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AccessTokensResponseDto>> {
        if (requestParameters.impersonateUserRequestDto === null || requestParameters.impersonateUserRequestDto === undefined) {
            throw new runtime.RequiredError('impersonateUserRequestDto','Required parameter requestParameters.impersonateUserRequestDto was null or undefined when calling impersonateUser.');
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
            path: `/api/admin/impersonate`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ImpersonateUserRequestDtoToJSON(requestParameters.impersonateUserRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AccessTokensResponseDtoFromJSON(jsonValue));
    }

    /**
     * Impersonates a user
     */
    async impersonateUser(requestParameters: ImpersonateUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AccessTokensResponseDto> {
        const response = await this.impersonateUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Set creator fee
     */
    async setCreatorFeeRaw(requestParameters: SetCreatorFeeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.setCreatorFeeRequestDto === null || requestParameters.setCreatorFeeRequestDto === undefined) {
            throw new runtime.RequiredError('setCreatorFeeRequestDto','Required parameter requestParameters.setCreatorFeeRequestDto was null or undefined when calling setCreatorFee.');
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
            path: `/api/admin/creator-fee/set`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SetCreatorFeeRequestDtoToJSON(requestParameters.setCreatorFeeRequestDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Set creator fee
     */
    async setCreatorFee(requestParameters: SetCreatorFeeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<boolean> {
        const response = await this.setCreatorFeeRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update external pass
     */
    async updateExternalPassRaw(requestParameters: UpdateExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.updateExternalPassRequestDto === null || requestParameters.updateExternalPassRequestDto === undefined) {
            throw new runtime.RequiredError('updateExternalPassRequestDto','Required parameter requestParameters.updateExternalPassRequestDto was null or undefined when calling updateExternalPass.');
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
            path: `/api/admin/external-pass/update`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateExternalPassRequestDtoToJSON(requestParameters.updateExternalPassRequestDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Update external pass
     */
    async updateExternalPass(requestParameters: UpdateExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<boolean> {
        const response = await this.updateExternalPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

export const AdminSecurityInfo = new Set<string>([
    "addExternalPass",
    "addExternalPassAddress",
    "addUserExternalPass",
    "deleteExternalPass",
    "deleteExternalPassAddress",
    "deleteUserExternalPass",
    "flagAsAdult",
    "getCreatorFee",
    "impersonateUser",
    "setCreatorFee",
    "updateExternalPass",
])

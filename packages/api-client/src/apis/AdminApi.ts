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
  BooleanResponseDto,
  CreateExternalPassRequestDto,
  CreateManualPassRequestDto,
  CreatePassResponseDto,
  DeleteExternalPassAddressRequestDto,
  GetAgencyMembersResponseDto,
  GetChargebacksResponseDto,
  GetCreatorFeeRequestDto,
  GetCreatorFeeResponseDto,
  ImpersonateUserRequestDto,
  SetCreatorFeeRequestDto,
  UpdateAgencyMemberDto,
  UpdateChargebackRequestDto,
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
    BooleanResponseDtoFromJSON,
    BooleanResponseDtoToJSON,
    CreateExternalPassRequestDtoFromJSON,
    CreateExternalPassRequestDtoToJSON,
    CreateManualPassRequestDtoFromJSON,
    CreateManualPassRequestDtoToJSON,
    CreatePassResponseDtoFromJSON,
    CreatePassResponseDtoToJSON,
    DeleteExternalPassAddressRequestDtoFromJSON,
    DeleteExternalPassAddressRequestDtoToJSON,
    GetAgencyMembersResponseDtoFromJSON,
    GetAgencyMembersResponseDtoToJSON,
    GetChargebacksResponseDtoFromJSON,
    GetChargebacksResponseDtoToJSON,
    GetCreatorFeeRequestDtoFromJSON,
    GetCreatorFeeRequestDtoToJSON,
    GetCreatorFeeResponseDtoFromJSON,
    GetCreatorFeeResponseDtoToJSON,
    ImpersonateUserRequestDtoFromJSON,
    ImpersonateUserRequestDtoToJSON,
    SetCreatorFeeRequestDtoFromJSON,
    SetCreatorFeeRequestDtoToJSON,
    UpdateAgencyMemberDtoFromJSON,
    UpdateAgencyMemberDtoToJSON,
    UpdateChargebackRequestDtoFromJSON,
    UpdateChargebackRequestDtoToJSON,
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

export interface CreateManualPassRequest {
    createManualPassRequestDto: CreateManualPassRequestDto;
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

export interface GetCovetedMembersRequest {
    adminDto: AdminDto;
}

export interface GetCreatorFeeRequest {
    getCreatorFeeRequestDto: GetCreatorFeeRequestDto;
}

export interface GetUnprocessChargebacksRequest {
    adminDto: AdminDto;
}

export interface ImpersonateUserRequest {
    impersonateUserRequestDto: ImpersonateUserRequestDto;
}

export interface MarkPublicRequest {
    adminDto: AdminDto;
}

export interface MarkSuggestedRequest {
    adminDto: AdminDto;
}

export interface RemovePublicRequest {
    adminDto: AdminDto;
}

export interface RemoveSuggestedRequest {
    adminDto: AdminDto;
}

export interface SetCreatorFeeRequest {
    setCreatorFeeRequestDto: SetCreatorFeeRequestDto;
}

export interface SetupCreatorRequest {
    adminDto: AdminDto;
}

export interface UpdateChargebackRequest {
    updateChargebackRequestDto: UpdateChargebackRequestDto;
}

export interface UpdateCovetedMemberRequest {
    updateAgencyMemberDto: UpdateAgencyMemberDto;
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
    async addExternalPassRaw(requestParameters: AddExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.createExternalPassRequestDto === null || requestParameters.createExternalPassRequestDto === undefined) {
            throw new runtime.RequiredError('createExternalPassRequestDto','Required parameter requestParameters.createExternalPassRequestDto was null or undefined when calling addExternalPass.');
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
            path: `/api/admin/external-pass/add`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateExternalPassRequestDtoToJSON(requestParameters.createExternalPassRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Add external pass
     */
    async addExternalPass(requestParameters: AddExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.addExternalPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Add external pass address
     */
    async addExternalPassAddressRaw(requestParameters: AddExternalPassAddressRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.addExternalPassAddressRequestDto === null || requestParameters.addExternalPassAddressRequestDto === undefined) {
            throw new runtime.RequiredError('addExternalPassAddressRequestDto','Required parameter requestParameters.addExternalPassAddressRequestDto was null or undefined when calling addExternalPassAddress.');
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
            path: `/api/admin/external-pass/address/add`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddExternalPassAddressRequestDtoToJSON(requestParameters.addExternalPassAddressRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Add external pass address
     */
    async addExternalPassAddress(requestParameters: AddExternalPassAddressRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.addExternalPassAddressRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Add external pass for user
     */
    async addUserExternalPassRaw(requestParameters: AddUserExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.userExternalPassRequestDto === null || requestParameters.userExternalPassRequestDto === undefined) {
            throw new runtime.RequiredError('userExternalPassRequestDto','Required parameter requestParameters.userExternalPassRequestDto was null or undefined when calling addUserExternalPass.');
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
            path: `/api/admin/external-pass/user/add`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserExternalPassRequestDtoToJSON(requestParameters.userExternalPassRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Add external pass for user
     */
    async addUserExternalPass(requestParameters: AddUserExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.addUserExternalPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Create pass
     */
    async createManualPassRaw(requestParameters: CreateManualPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CreatePassResponseDto>> {
        if (requestParameters.createManualPassRequestDto === null || requestParameters.createManualPassRequestDto === undefined) {
            throw new runtime.RequiredError('createManualPassRequestDto','Required parameter requestParameters.createManualPassRequestDto was null or undefined when calling createManualPass.');
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
            path: `/api/admin/pass/create`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateManualPassRequestDtoToJSON(requestParameters.createManualPassRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CreatePassResponseDtoFromJSON(jsonValue));
    }

    /**
     * Create pass
     */
    async createManualPass(requestParameters: CreateManualPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CreatePassResponseDto> {
        const response = await this.createManualPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete external pass
     */
    async deleteExternalPassRaw(requestParameters: DeleteExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.updateExternalPassRequestDto === null || requestParameters.updateExternalPassRequestDto === undefined) {
            throw new runtime.RequiredError('updateExternalPassRequestDto','Required parameter requestParameters.updateExternalPassRequestDto was null or undefined when calling deleteExternalPass.');
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
            path: `/api/admin/external-pass/delete`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateExternalPassRequestDtoToJSON(requestParameters.updateExternalPassRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Delete external pass
     */
    async deleteExternalPass(requestParameters: DeleteExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.deleteExternalPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete external pass address
     */
    async deleteExternalPassAddressRaw(requestParameters: DeleteExternalPassAddressRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.deleteExternalPassAddressRequestDto === null || requestParameters.deleteExternalPassAddressRequestDto === undefined) {
            throw new runtime.RequiredError('deleteExternalPassAddressRequestDto','Required parameter requestParameters.deleteExternalPassAddressRequestDto was null or undefined when calling deleteExternalPassAddress.');
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
            path: `/api/admin/external-pass/address/delete`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DeleteExternalPassAddressRequestDtoToJSON(requestParameters.deleteExternalPassAddressRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Delete external pass address
     */
    async deleteExternalPassAddress(requestParameters: DeleteExternalPassAddressRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.deleteExternalPassAddressRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete external pass for user
     */
    async deleteUserExternalPassRaw(requestParameters: DeleteUserExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.userExternalPassRequestDto === null || requestParameters.userExternalPassRequestDto === undefined) {
            throw new runtime.RequiredError('userExternalPassRequestDto','Required parameter requestParameters.userExternalPassRequestDto was null or undefined when calling deleteUserExternalPass.');
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
            path: `/api/admin/external-pass/user/delete`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserExternalPassRequestDtoToJSON(requestParameters.userExternalPassRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Delete external pass for user
     */
    async deleteUserExternalPass(requestParameters: DeleteUserExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
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

        /* No auth for endpoint but always send access token */
        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
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
     * Update coveted member
     */
    async getCovetedMembersRaw(requestParameters: GetCovetedMembersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAgencyMembersResponseDto>> {
        if (requestParameters.adminDto === null || requestParameters.adminDto === undefined) {
            throw new runtime.RequiredError('adminDto','Required parameter requestParameters.adminDto was null or undefined when calling getCovetedMembers.');
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
            path: `/api/admin/coveted/members`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AdminDtoToJSON(requestParameters.adminDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAgencyMembersResponseDtoFromJSON(jsonValue));
    }

    /**
     * Update coveted member
     */
    async getCovetedMembers(requestParameters: GetCovetedMembersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAgencyMembersResponseDto> {
        const response = await this.getCovetedMembersRaw(requestParameters, initOverrides);
        return await response.value();
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

        /* No auth for endpoint but always send access token */
        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
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
     * Get unprocessed chargebacks
     */
    async getUnprocessChargebacksRaw(requestParameters: GetUnprocessChargebacksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetChargebacksResponseDto>> {
        if (requestParameters.adminDto === null || requestParameters.adminDto === undefined) {
            throw new runtime.RequiredError('adminDto','Required parameter requestParameters.adminDto was null or undefined when calling getUnprocessChargebacks.');
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
            path: `/api/admin/chargeback/unprocessed`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AdminDtoToJSON(requestParameters.adminDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetChargebacksResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get unprocessed chargebacks
     */
    async getUnprocessChargebacks(requestParameters: GetUnprocessChargebacksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetChargebacksResponseDto> {
        const response = await this.getUnprocessChargebacksRaw(requestParameters, initOverrides);
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

        /* No auth for endpoint but always send access token */
        const token = window.localStorage.getItem("access-token")
        if (token) {
            headerParameters["Authorization"] = `Bearer ${JSON.parse(token)}`;
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
     * Make creator public
     */
    async markPublicRaw(requestParameters: MarkPublicRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.adminDto === null || requestParameters.adminDto === undefined) {
            throw new runtime.RequiredError('adminDto','Required parameter requestParameters.adminDto was null or undefined when calling markPublic.');
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
            path: `/api/admin/public`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AdminDtoToJSON(requestParameters.adminDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Make creator public
     */
    async markPublic(requestParameters: MarkPublicRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.markPublicRaw(requestParameters, initOverrides);
    }

    /**
     * Make creator suggested
     */
    async markSuggestedRaw(requestParameters: MarkSuggestedRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.adminDto === null || requestParameters.adminDto === undefined) {
            throw new runtime.RequiredError('adminDto','Required parameter requestParameters.adminDto was null or undefined when calling markSuggested.');
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
            path: `/api/admin/suggested`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AdminDtoToJSON(requestParameters.adminDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Make creator suggested
     */
    async markSuggested(requestParameters: MarkSuggestedRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.markSuggestedRaw(requestParameters, initOverrides);
    }

    /**
     * Make creator private
     */
    async removePublicRaw(requestParameters: RemovePublicRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.adminDto === null || requestParameters.adminDto === undefined) {
            throw new runtime.RequiredError('adminDto','Required parameter requestParameters.adminDto was null or undefined when calling removePublic.');
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
            path: `/api/admin/private`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AdminDtoToJSON(requestParameters.adminDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Make creator private
     */
    async removePublic(requestParameters: RemovePublicRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.removePublicRaw(requestParameters, initOverrides);
    }

    /**
     * Make creator unsuggetsed
     */
    async removeSuggestedRaw(requestParameters: RemoveSuggestedRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.adminDto === null || requestParameters.adminDto === undefined) {
            throw new runtime.RequiredError('adminDto','Required parameter requestParameters.adminDto was null or undefined when calling removeSuggested.');
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
            path: `/api/admin/unsuggested`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AdminDtoToJSON(requestParameters.adminDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Make creator unsuggetsed
     */
    async removeSuggested(requestParameters: RemoveSuggestedRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.removeSuggestedRaw(requestParameters, initOverrides);
    }

    /**
     * Set creator fee
     */
    async setCreatorFeeRaw(requestParameters: SetCreatorFeeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.setCreatorFeeRequestDto === null || requestParameters.setCreatorFeeRequestDto === undefined) {
            throw new runtime.RequiredError('setCreatorFeeRequestDto','Required parameter requestParameters.setCreatorFeeRequestDto was null or undefined when calling setCreatorFee.');
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
            path: `/api/admin/creator-fee/set`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SetCreatorFeeRequestDtoToJSON(requestParameters.setCreatorFeeRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Set creator fee
     */
    async setCreatorFee(requestParameters: SetCreatorFeeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.setCreatorFeeRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Set user up as a creator
     */
    async setupCreatorRaw(requestParameters: SetupCreatorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.adminDto === null || requestParameters.adminDto === undefined) {
            throw new runtime.RequiredError('adminDto','Required parameter requestParameters.adminDto was null or undefined when calling setupCreator.');
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
            path: `/api/admin/creator`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AdminDtoToJSON(requestParameters.adminDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Set user up as a creator
     */
    async setupCreator(requestParameters: SetupCreatorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.setupCreatorRaw(requestParameters, initOverrides);
    }

    /**
     * Update chargeback
     */
    async updateChargebackRaw(requestParameters: UpdateChargebackRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.updateChargebackRequestDto === null || requestParameters.updateChargebackRequestDto === undefined) {
            throw new runtime.RequiredError('updateChargebackRequestDto','Required parameter requestParameters.updateChargebackRequestDto was null or undefined when calling updateChargeback.');
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
            path: `/api/admin/chargeback/update`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateChargebackRequestDtoToJSON(requestParameters.updateChargebackRequestDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Update chargeback
     */
    async updateChargeback(requestParameters: UpdateChargebackRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.updateChargebackRaw(requestParameters, initOverrides);
    }

    /**
     * Update coveted member
     */
    async updateCovetedMemberRaw(requestParameters: UpdateCovetedMemberRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.updateAgencyMemberDto === null || requestParameters.updateAgencyMemberDto === undefined) {
            throw new runtime.RequiredError('updateAgencyMemberDto','Required parameter requestParameters.updateAgencyMemberDto was null or undefined when calling updateCovetedMember.');
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
            path: `/api/admin/coveted/member/update`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateAgencyMemberDtoToJSON(requestParameters.updateAgencyMemberDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Update coveted member
     */
    async updateCovetedMember(requestParameters: UpdateCovetedMemberRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.updateCovetedMemberRaw(requestParameters, initOverrides);
    }

    /**
     * Update external pass
     */
    async updateExternalPassRaw(requestParameters: UpdateExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BooleanResponseDto>> {
        if (requestParameters.updateExternalPassRequestDto === null || requestParameters.updateExternalPassRequestDto === undefined) {
            throw new runtime.RequiredError('updateExternalPassRequestDto','Required parameter requestParameters.updateExternalPassRequestDto was null or undefined when calling updateExternalPass.');
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
            path: `/api/admin/external-pass/update`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateExternalPassRequestDtoToJSON(requestParameters.updateExternalPassRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BooleanResponseDtoFromJSON(jsonValue));
    }

    /**
     * Update external pass
     */
    async updateExternalPass(requestParameters: UpdateExternalPassRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BooleanResponseDto> {
        const response = await this.updateExternalPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

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
    CreatePassHolderRequestDto,
    CreatePassHolderRequestDtoFromJSON,
    CreatePassHolderRequestDtoToJSON,
    CreatePassRequestDto,
    CreatePassRequestDtoFromJSON,
    CreatePassRequestDtoToJSON,
    GetPassHoldersResponseDto,
    GetPassHoldersResponseDtoFromJSON,
    GetPassHoldersResponseDtoToJSON,
    GetPassResponseDto,
    GetPassResponseDtoFromJSON,
    GetPassResponseDtoToJSON,
    GetPassesResponseDto,
    GetPassesResponseDtoFromJSON,
    GetPassesResponseDtoToJSON,
    PayinDataDto,
    PayinDataDtoFromJSON,
    PayinDataDtoToJSON,
    RegisterPayinResponseDto,
    RegisterPayinResponseDtoFromJSON,
    RegisterPayinResponseDtoToJSON,
    RenewPassHolderRequestDto,
    RenewPassHolderRequestDtoFromJSON,
    RenewPassHolderRequestDtoToJSON,
    UpdatePassRequestDto,
    UpdatePassRequestDtoFromJSON,
    UpdatePassRequestDtoToJSON,
} from '../models';

export interface AddPassSubscriptionRequest {
    passHolderId: string;
}

export interface CreatePassRequest {
    createPassRequestDto: CreatePassRequestDto;
}

export interface FindPassRequest {
    passId: string;
}

export interface GetCreatorPassesRequest {
    creatorId: string;
}

export interface GetPassHoldersRequest {
    passId: string;
}

export interface GetPassHoldingsRequest {
    creatorId: string;
}

export interface PinPassRequest {
    passId: string;
}

export interface RegisterBuyPassRequest {
    createPassHolderRequestDto: CreatePassHolderRequestDto;
}

export interface RegisterBuyPassDataRequest {
    createPassHolderRequestDto: CreatePassHolderRequestDto;
}

export interface RegisterRenewPassRequest {
    renewPassHolderRequestDto: RenewPassHolderRequestDto;
}

export interface RegisterRenewPassDataRequest {
    renewPassHolderRequestDto: RenewPassHolderRequestDto;
}

export interface UnpinPassRequest {
    passId: string;
}

export interface UpdatePassRequest {
    passId: string;
    updatePassRequestDto: UpdatePassRequestDto;
}

/**
 * 
 */
export class PassApi extends runtime.BaseAPI {

    /**
     * Add pass subscription
     */
    async addPassSubscriptionRaw(requestParameters: AddPassSubscriptionRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.passHolderId === null || requestParameters.passHolderId === undefined) {
            throw new runtime.RequiredError('passHolderId','Required parameter requestParameters.passHolderId was null or undefined when calling addPassSubscription.');
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
            path: `/api/pass/subscription/add/{passHolderId}`.replace(`{${"passHolderId"}}`, encodeURIComponent(String(requestParameters.passHolderId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Add pass subscription
     */
    async addPassSubscription(requestParameters: AddPassSubscriptionRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.addPassSubscriptionRaw(requestParameters, initOverrides);
    }

    /**
     * Creates a pass
     */
    async createPassRaw(requestParameters: CreatePassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.createPassRequestDto === null || requestParameters.createPassRequestDto === undefined) {
            throw new runtime.RequiredError('createPassRequestDto','Required parameter requestParameters.createPassRequestDto was null or undefined when calling createPass.');
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
            path: `/api/pass`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreatePassRequestDtoToJSON(requestParameters.createPassRequestDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Creates a pass
     */
    async createPass(requestParameters: CreatePassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<boolean> {
        const response = await this.createPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets a pass
     */
    async findPassRaw(requestParameters: FindPassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetPassResponseDto>> {
        if (requestParameters.passId === null || requestParameters.passId === undefined) {
            throw new runtime.RequiredError('passId','Required parameter requestParameters.passId was null or undefined when calling findPass.');
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
            path: `/api/pass/{passId}`.replace(`{${"passId"}}`, encodeURIComponent(String(requestParameters.passId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetPassResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets a pass
     */
    async findPass(requestParameters: FindPassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetPassResponseDto> {
        const response = await this.findPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets passes created by a creator
     */
    async getCreatorPassesRaw(requestParameters: GetCreatorPassesRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetPassesResponseDto>> {
        if (requestParameters.creatorId === null || requestParameters.creatorId === undefined) {
            throw new runtime.RequiredError('creatorId','Required parameter requestParameters.creatorId was null or undefined when calling getCreatorPasses.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/pass/created/{creatorId}`.replace(`{${"creatorId"}}`, encodeURIComponent(String(requestParameters.creatorId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetPassesResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets passes created by a creator
     */
    async getCreatorPasses(requestParameters: GetCreatorPassesRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetPassesResponseDto> {
        const response = await this.getCreatorPassesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get a passholders
     */
    async getPassHoldersRaw(requestParameters: GetPassHoldersRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetPassHoldersResponseDto>> {
        if (requestParameters.passId === null || requestParameters.passId === undefined) {
            throw new runtime.RequiredError('passId','Required parameter requestParameters.passId was null or undefined when calling getPassHolders.');
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
            path: `/api/pass/passholders/{passId}`.replace(`{${"passId"}}`, encodeURIComponent(String(requestParameters.passId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetPassHoldersResponseDtoFromJSON(jsonValue));
    }

    /**
     * Get a passholders
     */
    async getPassHolders(requestParameters: GetPassHoldersRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetPassHoldersResponseDto> {
        const response = await this.getPassHoldersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Gets passes held by user
     */
    async getPassHoldingsRaw(requestParameters: GetPassHoldingsRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetPassHoldersResponseDto>> {
        if (requestParameters.creatorId === null || requestParameters.creatorId === undefined) {
            throw new runtime.RequiredError('creatorId','Required parameter requestParameters.creatorId was null or undefined when calling getPassHoldings.');
        }

        const queryParameters: any = {};

        if (requestParameters.creatorId !== undefined) {
            queryParameters['creatorId'] = requestParameters.creatorId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/api/pass/passholdings`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetPassHoldersResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets passes held by user
     */
    async getPassHoldings(requestParameters: GetPassHoldingsRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetPassHoldersResponseDto> {
        const response = await this.getPassHoldingsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Pin a pass
     */
    async pinPassRaw(requestParameters: PinPassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.passId === null || requestParameters.passId === undefined) {
            throw new runtime.RequiredError('passId','Required parameter requestParameters.passId was null or undefined when calling pinPass.');
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
            path: `/api/pass/pin/{passId}`.replace(`{${"passId"}}`, encodeURIComponent(String(requestParameters.passId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Pin a pass
     */
    async pinPass(requestParameters: PinPassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<boolean> {
        const response = await this.pinPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Register create pass payin
     */
    async registerBuyPassRaw(requestParameters: RegisterBuyPassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<RegisterPayinResponseDto>> {
        if (requestParameters.createPassHolderRequestDto === null || requestParameters.createPassHolderRequestDto === undefined) {
            throw new runtime.RequiredError('createPassHolderRequestDto','Required parameter requestParameters.createPassHolderRequestDto was null or undefined when calling registerBuyPass.');
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
            path: `/api/pass/pay/create`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreatePassHolderRequestDtoToJSON(requestParameters.createPassHolderRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RegisterPayinResponseDtoFromJSON(jsonValue));
    }

    /**
     * Register create pass payin
     */
    async registerBuyPass(requestParameters: RegisterBuyPassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<RegisterPayinResponseDto> {
        const response = await this.registerBuyPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get register create pass data
     */
    async registerBuyPassDataRaw(requestParameters: RegisterBuyPassDataRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<PayinDataDto>> {
        if (requestParameters.createPassHolderRequestDto === null || requestParameters.createPassHolderRequestDto === undefined) {
            throw new runtime.RequiredError('createPassHolderRequestDto','Required parameter requestParameters.createPassHolderRequestDto was null or undefined when calling registerBuyPassData.');
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
            path: `/api/pass/pay/data/create`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreatePassHolderRequestDtoToJSON(requestParameters.createPassHolderRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PayinDataDtoFromJSON(jsonValue));
    }

    /**
     * Get register create pass data
     */
    async registerBuyPassData(requestParameters: RegisterBuyPassDataRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<PayinDataDto> {
        const response = await this.registerBuyPassDataRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Register renew pass payin
     */
    async registerRenewPassRaw(requestParameters: RegisterRenewPassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<RegisterPayinResponseDto>> {
        if (requestParameters.renewPassHolderRequestDto === null || requestParameters.renewPassHolderRequestDto === undefined) {
            throw new runtime.RequiredError('renewPassHolderRequestDto','Required parameter requestParameters.renewPassHolderRequestDto was null or undefined when calling registerRenewPass.');
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
            path: `/api/pass/pay/renew`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RenewPassHolderRequestDtoToJSON(requestParameters.renewPassHolderRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RegisterPayinResponseDtoFromJSON(jsonValue));
    }

    /**
     * Register renew pass payin
     */
    async registerRenewPass(requestParameters: RegisterRenewPassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<RegisterPayinResponseDto> {
        const response = await this.registerRenewPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get register renew pass data
     */
    async registerRenewPassDataRaw(requestParameters: RegisterRenewPassDataRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<PayinDataDto>> {
        if (requestParameters.renewPassHolderRequestDto === null || requestParameters.renewPassHolderRequestDto === undefined) {
            throw new runtime.RequiredError('renewPassHolderRequestDto','Required parameter requestParameters.renewPassHolderRequestDto was null or undefined when calling registerRenewPassData.');
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
            path: `/api/pass/pay/data/renew`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RenewPassHolderRequestDtoToJSON(requestParameters.renewPassHolderRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PayinDataDtoFromJSON(jsonValue));
    }

    /**
     * Get register renew pass data
     */
    async registerRenewPassData(requestParameters: RegisterRenewPassDataRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<PayinDataDto> {
        const response = await this.registerRenewPassDataRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Unpin a pass
     */
    async unpinPassRaw(requestParameters: UnpinPassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.passId === null || requestParameters.passId === undefined) {
            throw new runtime.RequiredError('passId','Required parameter requestParameters.passId was null or undefined when calling unpinPass.');
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
            path: `/api/pass/unpin/{passId}`.replace(`{${"passId"}}`, encodeURIComponent(String(requestParameters.passId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Unpin a pass
     */
    async unpinPass(requestParameters: UnpinPassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<boolean> {
        const response = await this.unpinPassRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Updates a pass
     */
    async updatePassRaw(requestParameters: UpdatePassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetPassResponseDto>> {
        if (requestParameters.passId === null || requestParameters.passId === undefined) {
            throw new runtime.RequiredError('passId','Required parameter requestParameters.passId was null or undefined when calling updatePass.');
        }

        if (requestParameters.updatePassRequestDto === null || requestParameters.updatePassRequestDto === undefined) {
            throw new runtime.RequiredError('updatePassRequestDto','Required parameter requestParameters.updatePassRequestDto was null or undefined when calling updatePass.');
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
            path: `/api/pass/{passId}`.replace(`{${"passId"}}`, encodeURIComponent(String(requestParameters.passId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdatePassRequestDtoToJSON(requestParameters.updatePassRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetPassResponseDtoFromJSON(jsonValue));
    }

    /**
     * Updates a pass
     */
    async updatePass(requestParameters: UpdatePassRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetPassResponseDto> {
        const response = await this.updatePassRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

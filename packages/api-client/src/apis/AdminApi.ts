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
    ImpersonateUserRequestDto,
    ImpersonateUserRequestDtoFromJSON,
    ImpersonateUserRequestDtoToJSON,
} from '../models';

export interface ImpersonateUserRequest {
    impersonateUserRequestDto: ImpersonateUserRequestDto;
}

/**
 * 
 */
export class AdminApi extends runtime.BaseAPI {

    /**
     * Impersonates a user
     */
    async impersonateUserRaw(requestParameters: ImpersonateUserRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.impersonateUserRequestDto === null || requestParameters.impersonateUserRequestDto === undefined) {
            throw new runtime.RequiredError('impersonateUserRequestDto','Required parameter requestParameters.impersonateUserRequestDto was null or undefined when calling impersonateUser.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/admin/impersonate`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ImpersonateUserRequestDtoToJSON(requestParameters.impersonateUserRequestDto),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Impersonates a user
     */
    async impersonateUser(requestParameters: ImpersonateUserRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<void> {
        await this.impersonateUserRaw(requestParameters, initOverrides);
    }

}

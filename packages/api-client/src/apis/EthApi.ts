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
    CreateEthNftCollectionRequestDto,
    CreateEthNftCollectionRequestDtoFromJSON,
    CreateEthNftCollectionRequestDtoToJSON,
    GetEthNftCollectionResponseDto,
    GetEthNftCollectionResponseDtoFromJSON,
    GetEthNftCollectionResponseDtoToJSON,
} from '../models';

export interface CreateEthNftCollectionRequest {
    createEthNftCollectionRequestDto: CreateEthNftCollectionRequestDto;
}

/**
 * 
 */
export class EthApi extends runtime.BaseAPI {

    /**
     * Creates ETH NFT Collection
     */
    async createEthNftCollectionRaw(requestParameters: CreateEthNftCollectionRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<GetEthNftCollectionResponseDto>> {
        if (requestParameters.createEthNftCollectionRequestDto === null || requestParameters.createEthNftCollectionRequestDto === undefined) {
            throw new runtime.RequiredError('createEthNftCollectionRequestDto','Required parameter requestParameters.createEthNftCollectionRequestDto was null or undefined when calling createEthNftCollection.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/eth/nftcollection`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateEthNftCollectionRequestDtoToJSON(requestParameters.createEthNftCollectionRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetEthNftCollectionResponseDtoFromJSON(jsonValue));
    }

    /**
     * Creates ETH NFT Collection
     */
    async createEthNftCollection(requestParameters: CreateEthNftCollectionRequest, initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<GetEthNftCollectionResponseDto> {
        const response = await this.createEthNftCollectionRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

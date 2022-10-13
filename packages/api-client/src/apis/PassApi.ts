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

import * as runtime from '../runtime'
import type {
  BooleanResponseDto,
  CreatePassHolderRequestDto,
  CreatePassRequestDto,
  CreatePassResponseDto,
  GetExternalPassesResponseDto,
  GetPassHoldersRequestDto,
  GetPassHoldersResponseDto,
  GetPassHoldingsRequestDto,
  GetPassHoldingsResponseDto,
  GetPassesRequestDto,
  GetPassesResponseDto,
  MintPassRequestDto,
  MintPassResponseDto,
  PayinDataDto,
  RegisterPayinResponseDto,
  RenewPassHolderRequestDto,
  UpdatePassRequestDto,
} from '../models'
import {
  BooleanResponseDtoFromJSON,
  BooleanResponseDtoToJSON,
  CreatePassHolderRequestDtoFromJSON,
  CreatePassHolderRequestDtoToJSON,
  CreatePassRequestDtoFromJSON,
  CreatePassRequestDtoToJSON,
  CreatePassResponseDtoFromJSON,
  CreatePassResponseDtoToJSON,
  GetExternalPassesResponseDtoFromJSON,
  GetExternalPassesResponseDtoToJSON,
  GetPassHoldersRequestDtoFromJSON,
  GetPassHoldersRequestDtoToJSON,
  GetPassHoldersResponseDtoFromJSON,
  GetPassHoldersResponseDtoToJSON,
  GetPassHoldingsRequestDtoFromJSON,
  GetPassHoldingsRequestDtoToJSON,
  GetPassHoldingsResponseDtoFromJSON,
  GetPassHoldingsResponseDtoToJSON,
  GetPassesRequestDtoFromJSON,
  GetPassesRequestDtoToJSON,
  GetPassesResponseDtoFromJSON,
  GetPassesResponseDtoToJSON,
  MintPassRequestDtoFromJSON,
  MintPassRequestDtoToJSON,
  MintPassResponseDtoFromJSON,
  MintPassResponseDtoToJSON,
  PayinDataDtoFromJSON,
  PayinDataDtoToJSON,
  RegisterPayinResponseDtoFromJSON,
  RegisterPayinResponseDtoToJSON,
  RenewPassHolderRequestDtoFromJSON,
  RenewPassHolderRequestDtoToJSON,
  UpdatePassRequestDtoFromJSON,
  UpdatePassRequestDtoToJSON,
} from '../models'

export interface AddPassSubscriptionRequest {
  passHolderId: string
}

export interface CreatePassRequest {
  createPassRequestDto: CreatePassRequestDto
}

export interface GetCreatorPassesRequest {
  getPassesRequestDto: GetPassesRequestDto
}

export interface GetExternalPassesRequest {
  getPassesRequestDto: GetPassesRequestDto
}

export interface GetPassHoldersRequest {
  getPassHoldersRequestDto: GetPassHoldersRequestDto
}

export interface GetPassHoldingsRequest {
  getPassHoldingsRequestDto: GetPassHoldingsRequestDto
}

export interface MintPassRequest {
  mintPassRequestDto: MintPassRequestDto
}

export interface PatrickPassRequest {
  createPassRequestDto: CreatePassRequestDto
}

export interface PinPassRequest {
  passId: string
}

export interface RegisterBuyPassRequest {
  createPassHolderRequestDto: CreatePassHolderRequestDto
}

export interface RegisterBuyPassDataRequest {
  createPassHolderRequestDto: CreatePassHolderRequestDto
}

export interface RegisterRenewPassRequest {
  renewPassHolderRequestDto: RenewPassHolderRequestDto
}

export interface RegisterRenewPassDataRequest {
  renewPassHolderRequestDto: RenewPassHolderRequestDto
}

export interface UnpinPassRequest {
  passId: string
}

export interface UpdatePassRequest {
  passId: string
  updatePassRequestDto: UpdatePassRequestDto
}

/**
 *
 */
export class PassApi extends runtime.BaseAPI {
  /**
   * Add pass subscription
   */
  async addPassSubscriptionRaw(
    requestParameters: AddPassSubscriptionRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<void>> {
    if (
      requestParameters.passHolderId === null ||
      requestParameters.passHolderId === undefined
    ) {
      throw new runtime.RequiredError(
        'passHolderId',
        'Required parameter requestParameters.passHolderId was null or undefined when calling addPassSubscription.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    const token = window.localStorage.getItem('access-token')

    if (token) {
      headerParameters['Authorization'] = `Bearer ${JSON.parse(token)}`
    }
    const response = await this.request(
      {
        path: `/api/pass/subscription/add/{passHolderId}`.replace(
          `{${'passHolderId'}}`,
          encodeURIComponent(String(requestParameters.passHolderId)),
        ),
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    )

    return new runtime.VoidApiResponse(response)
  }

  /**
   * Add pass subscription
   */
  async addPassSubscription(
    requestParameters: AddPassSubscriptionRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<void> {
    await this.addPassSubscriptionRaw(requestParameters, initOverrides)
  }

  /**
   * Creates a pass
   */
  async createPassRaw(
    requestParameters: CreatePassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<CreatePassResponseDto>> {
    if (
      requestParameters.createPassRequestDto === null ||
      requestParameters.createPassRequestDto === undefined
    ) {
      throw new runtime.RequiredError(
        'createPassRequestDto',
        'Required parameter requestParameters.createPassRequestDto was null or undefined when calling createPass.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    const token = window.localStorage.getItem('access-token')

    if (token) {
      headerParameters['Authorization'] = `Bearer ${JSON.parse(token)}`
    }
    const response = await this.request(
      {
        path: `/api/pass`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: CreatePassRequestDtoToJSON(
          requestParameters.createPassRequestDto,
        ),
      },
      initOverrides,
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      CreatePassResponseDtoFromJSON(jsonValue),
    )
  }

  /**
   * Creates a pass
   */
  async createPass(
    requestParameters: CreatePassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<CreatePassResponseDto> {
    const response = await this.createPassRaw(requestParameters, initOverrides)
    return await response.value()
  }

  /**
   * Gets passes created by a creator
   */
  async getCreatorPassesRaw(
    requestParameters: GetCreatorPassesRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<GetPassesResponseDto>> {
    if (
      requestParameters.getPassesRequestDto === null ||
      requestParameters.getPassesRequestDto === undefined
    ) {
      throw new runtime.RequiredError(
        'getPassesRequestDto',
        'Required parameter requestParameters.getPassesRequestDto was null or undefined when calling getCreatorPasses.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    const response = await this.request(
      {
        path: `/api/pass/creator-passes`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: GetPassesRequestDtoToJSON(requestParameters.getPassesRequestDto),
      },
      initOverrides,
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      GetPassesResponseDtoFromJSON(jsonValue),
    )
  }

  /**
   * Gets passes created by a creator
   */
  async getCreatorPasses(
    requestParameters: GetCreatorPassesRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<GetPassesResponseDto> {
    const response = await this.getCreatorPassesRaw(
      requestParameters,
      initOverrides,
    )
    return await response.value()
  }

  /**
   * Gets external passes
   */
  async getExternalPassesRaw(
    requestParameters: GetExternalPassesRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<GetExternalPassesResponseDto>> {
    if (
      requestParameters.getPassesRequestDto === null ||
      requestParameters.getPassesRequestDto === undefined
    ) {
      throw new runtime.RequiredError(
        'getPassesRequestDto',
        'Required parameter requestParameters.getPassesRequestDto was null or undefined when calling getExternalPasses.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    const response = await this.request(
      {
        path: `/api/pass/external`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: GetPassesRequestDtoToJSON(requestParameters.getPassesRequestDto),
      },
      initOverrides,
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      GetExternalPassesResponseDtoFromJSON(jsonValue),
    )
  }

  /**
   * Gets external passes
   */
  async getExternalPasses(
    requestParameters: GetExternalPassesRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<GetExternalPassesResponseDto> {
    const response = await this.getExternalPassesRaw(
      requestParameters,
      initOverrides,
    )
    return await response.value()
  }

  /**
   * Get passholders of a pass or user
   */
  async getPassHoldersRaw(
    requestParameters: GetPassHoldersRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<GetPassHoldersResponseDto>> {
    if (
      requestParameters.getPassHoldersRequestDto === null ||
      requestParameters.getPassHoldersRequestDto === undefined
    ) {
      throw new runtime.RequiredError(
        'getPassHoldersRequestDto',
        'Required parameter requestParameters.getPassHoldersRequestDto was null or undefined when calling getPassHolders.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    const token = window.localStorage.getItem('access-token')

    if (token) {
      headerParameters['Authorization'] = `Bearer ${JSON.parse(token)}`
    }
    const response = await this.request(
      {
        path: `/api/pass/passholders`,
        method: 'GET',
        headers: headerParameters,
        query: queryParameters,
        body: GetPassHoldersRequestDtoToJSON(
          requestParameters.getPassHoldersRequestDto,
        ),
      },
      initOverrides,
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      GetPassHoldersResponseDtoFromJSON(jsonValue),
    )
  }

  /**
   * Get passholders of a pass or user
   */
  async getPassHolders(
    requestParameters: GetPassHoldersRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<GetPassHoldersResponseDto> {
    const response = await this.getPassHoldersRaw(
      requestParameters,
      initOverrides,
    )
    return await response.value()
  }

  /**
   * Gets passes held by user
   */
  async getPassHoldingsRaw(
    requestParameters: GetPassHoldingsRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<GetPassHoldingsResponseDto>> {
    if (
      requestParameters.getPassHoldingsRequestDto === null ||
      requestParameters.getPassHoldingsRequestDto === undefined
    ) {
      throw new runtime.RequiredError(
        'getPassHoldingsRequestDto',
        'Required parameter requestParameters.getPassHoldingsRequestDto was null or undefined when calling getPassHoldings.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    const token = window.localStorage.getItem('access-token')

    if (token) {
      headerParameters['Authorization'] = `Bearer ${JSON.parse(token)}`
    }
    const response = await this.request(
      {
        path: `/api/pass/passholdings`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: GetPassHoldingsRequestDtoToJSON(
          requestParameters.getPassHoldingsRequestDto,
        ),
      },
      initOverrides,
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      GetPassHoldingsResponseDtoFromJSON(jsonValue),
    )
  }

  /**
   * Gets passes held by user
   */
  async getPassHoldings(
    requestParameters: GetPassHoldingsRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<GetPassHoldingsResponseDto> {
    const response = await this.getPassHoldingsRaw(
      requestParameters,
      initOverrides,
    )
    return await response.value()
  }

  /**
   * Mints a pass
   */
  async mintPassRaw(
    requestParameters: MintPassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<MintPassResponseDto>> {
    if (
      requestParameters.mintPassRequestDto === null ||
      requestParameters.mintPassRequestDto === undefined
    ) {
      throw new runtime.RequiredError(
        'mintPassRequestDto',
        'Required parameter requestParameters.mintPassRequestDto was null or undefined when calling mintPass.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    const token = window.localStorage.getItem('access-token')

    if (token) {
      headerParameters['Authorization'] = `Bearer ${JSON.parse(token)}`
    }
    const response = await this.request(
      {
        path: `/api/pass/mint`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: MintPassRequestDtoToJSON(requestParameters.mintPassRequestDto),
      },
      initOverrides,
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      MintPassResponseDtoFromJSON(jsonValue),
    )
  }

  /**
   * Mints a pass
   */
  async mintPass(
    requestParameters: MintPassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<MintPassResponseDto> {
    const response = await this.mintPassRaw(requestParameters, initOverrides)
    return await response.value()
  }

  /**
   * patrick pass
   */
  async patrickPassRaw(
    requestParameters: PatrickPassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<CreatePassResponseDto>> {
    if (
      requestParameters.createPassRequestDto === null ||
      requestParameters.createPassRequestDto === undefined
    ) {
      throw new runtime.RequiredError(
        'createPassRequestDto',
        'Required parameter requestParameters.createPassRequestDto was null or undefined when calling patrickPass.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    const token = window.localStorage.getItem('access-token')

    if (token) {
      headerParameters['Authorization'] = `Bearer ${JSON.parse(token)}`
    }
    const response = await this.request(
      {
        path: `/api/pass/patrick`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: CreatePassRequestDtoToJSON(
          requestParameters.createPassRequestDto,
        ),
      },
      initOverrides,
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      CreatePassResponseDtoFromJSON(jsonValue),
    )
  }

  /**
   * patrick pass
   */
  async patrickPass(
    requestParameters: PatrickPassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<CreatePassResponseDto> {
    const response = await this.patrickPassRaw(requestParameters, initOverrides)
    return await response.value()
  }

  /**
   * Pin a pass
   */
  async pinPassRaw(
    requestParameters: PinPassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<BooleanResponseDto>> {
    if (
      requestParameters.passId === null ||
      requestParameters.passId === undefined
    ) {
      throw new runtime.RequiredError(
        'passId',
        'Required parameter requestParameters.passId was null or undefined when calling pinPass.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    const token = window.localStorage.getItem('access-token')

    if (token) {
      headerParameters['Authorization'] = `Bearer ${JSON.parse(token)}`
    }
    const response = await this.request(
      {
        path: `/api/pass/pin/{passId}`.replace(
          `{${'passId'}}`,
          encodeURIComponent(String(requestParameters.passId)),
        ),
        method: 'GET',
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      BooleanResponseDtoFromJSON(jsonValue),
    )
  }

  /**
   * Pin a pass
   */
  async pinPass(
    requestParameters: PinPassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<BooleanResponseDto> {
    const response = await this.pinPassRaw(requestParameters, initOverrides)
    return await response.value()
  }

  /**
   * Register create pass payin
   */
  async registerBuyPassRaw(
    requestParameters: RegisterBuyPassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<RegisterPayinResponseDto>> {
    if (
      requestParameters.createPassHolderRequestDto === null ||
      requestParameters.createPassHolderRequestDto === undefined
    ) {
      throw new runtime.RequiredError(
        'createPassHolderRequestDto',
        'Required parameter requestParameters.createPassHolderRequestDto was null or undefined when calling registerBuyPass.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    const token = window.localStorage.getItem('access-token')

    if (token) {
      headerParameters['Authorization'] = `Bearer ${JSON.parse(token)}`
    }
    const response = await this.request(
      {
        path: `/api/pass/buy/create`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: CreatePassHolderRequestDtoToJSON(
          requestParameters.createPassHolderRequestDto,
        ),
      },
      initOverrides,
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      RegisterPayinResponseDtoFromJSON(jsonValue),
    )
  }

  /**
   * Register create pass payin
   */
  async registerBuyPass(
    requestParameters: RegisterBuyPassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<RegisterPayinResponseDto> {
    const response = await this.registerBuyPassRaw(
      requestParameters,
      initOverrides,
    )
    return await response.value()
  }

  /**
   * Get register create pass data
   */
  async registerBuyPassDataRaw(
    requestParameters: RegisterBuyPassDataRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<PayinDataDto>> {
    if (
      requestParameters.createPassHolderRequestDto === null ||
      requestParameters.createPassHolderRequestDto === undefined
    ) {
      throw new runtime.RequiredError(
        'createPassHolderRequestDto',
        'Required parameter requestParameters.createPassHolderRequestDto was null or undefined when calling registerBuyPassData.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    const token = window.localStorage.getItem('access-token')

    if (token) {
      headerParameters['Authorization'] = `Bearer ${JSON.parse(token)}`
    }
    const response = await this.request(
      {
        path: `/api/pass/buy/create/data`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: CreatePassHolderRequestDtoToJSON(
          requestParameters.createPassHolderRequestDto,
        ),
      },
      initOverrides,
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      PayinDataDtoFromJSON(jsonValue),
    )
  }

  /**
   * Get register create pass data
   */
  async registerBuyPassData(
    requestParameters: RegisterBuyPassDataRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<PayinDataDto> {
    const response = await this.registerBuyPassDataRaw(
      requestParameters,
      initOverrides,
    )
    return await response.value()
  }

  /**
   * Register renew pass payin
   */
  async registerRenewPassRaw(
    requestParameters: RegisterRenewPassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<RegisterPayinResponseDto>> {
    if (
      requestParameters.renewPassHolderRequestDto === null ||
      requestParameters.renewPassHolderRequestDto === undefined
    ) {
      throw new runtime.RequiredError(
        'renewPassHolderRequestDto',
        'Required parameter requestParameters.renewPassHolderRequestDto was null or undefined when calling registerRenewPass.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    const token = window.localStorage.getItem('access-token')

    if (token) {
      headerParameters['Authorization'] = `Bearer ${JSON.parse(token)}`
    }
    const response = await this.request(
      {
        path: `/api/pass/buy/renew`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: RenewPassHolderRequestDtoToJSON(
          requestParameters.renewPassHolderRequestDto,
        ),
      },
      initOverrides,
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      RegisterPayinResponseDtoFromJSON(jsonValue),
    )
  }

  /**
   * Register renew pass payin
   */
  async registerRenewPass(
    requestParameters: RegisterRenewPassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<RegisterPayinResponseDto> {
    const response = await this.registerRenewPassRaw(
      requestParameters,
      initOverrides,
    )
    return await response.value()
  }

  /**
   * Get register renew pass data
   */
  async registerRenewPassDataRaw(
    requestParameters: RegisterRenewPassDataRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<PayinDataDto>> {
    if (
      requestParameters.renewPassHolderRequestDto === null ||
      requestParameters.renewPassHolderRequestDto === undefined
    ) {
      throw new runtime.RequiredError(
        'renewPassHolderRequestDto',
        'Required parameter requestParameters.renewPassHolderRequestDto was null or undefined when calling registerRenewPassData.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    const token = window.localStorage.getItem('access-token')

    if (token) {
      headerParameters['Authorization'] = `Bearer ${JSON.parse(token)}`
    }
    const response = await this.request(
      {
        path: `/api/pass/buy/renew/data`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: RenewPassHolderRequestDtoToJSON(
          requestParameters.renewPassHolderRequestDto,
        ),
      },
      initOverrides,
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      PayinDataDtoFromJSON(jsonValue),
    )
  }

  /**
   * Get register renew pass data
   */
  async registerRenewPassData(
    requestParameters: RegisterRenewPassDataRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<PayinDataDto> {
    const response = await this.registerRenewPassDataRaw(
      requestParameters,
      initOverrides,
    )
    return await response.value()
  }

  /**
   * Unpin a pass
   */
  async unpinPassRaw(
    requestParameters: UnpinPassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<BooleanResponseDto>> {
    if (
      requestParameters.passId === null ||
      requestParameters.passId === undefined
    ) {
      throw new runtime.RequiredError(
        'passId',
        'Required parameter requestParameters.passId was null or undefined when calling unpinPass.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    const token = window.localStorage.getItem('access-token')

    if (token) {
      headerParameters['Authorization'] = `Bearer ${JSON.parse(token)}`
    }
    const response = await this.request(
      {
        path: `/api/pass/unpin/{passId}`.replace(
          `{${'passId'}}`,
          encodeURIComponent(String(requestParameters.passId)),
        ),
        method: 'GET',
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    )

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      BooleanResponseDtoFromJSON(jsonValue),
    )
  }

  /**
   * Unpin a pass
   */
  async unpinPass(
    requestParameters: UnpinPassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<BooleanResponseDto> {
    const response = await this.unpinPassRaw(requestParameters, initOverrides)
    return await response.value()
  }

  /**
   * Updates a pass
   */
  async updatePassRaw(
    requestParameters: UpdatePassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<void>> {
    if (
      requestParameters.passId === null ||
      requestParameters.passId === undefined
    ) {
      throw new runtime.RequiredError(
        'passId',
        'Required parameter requestParameters.passId was null or undefined when calling updatePass.',
      )
    }

    if (
      requestParameters.updatePassRequestDto === null ||
      requestParameters.updatePassRequestDto === undefined
    ) {
      throw new runtime.RequiredError(
        'updatePassRequestDto',
        'Required parameter requestParameters.updatePassRequestDto was null or undefined when calling updatePass.',
      )
    }

    const queryParameters: any = {}

    const headerParameters: runtime.HTTPHeaders = {}

    headerParameters['Content-Type'] = 'application/json'

    const token = window.localStorage.getItem('access-token')

    if (token) {
      headerParameters['Authorization'] = `Bearer ${JSON.parse(token)}`
    }
    const response = await this.request(
      {
        path: `/api/pass/pass-info/{passId}`.replace(
          `{${'passId'}}`,
          encodeURIComponent(String(requestParameters.passId)),
        ),
        method: 'PATCH',
        headers: headerParameters,
        query: queryParameters,
        body: UpdatePassRequestDtoToJSON(
          requestParameters.updatePassRequestDto,
        ),
      },
      initOverrides,
    )

    return new runtime.VoidApiResponse(response)
  }

  /**
   * Updates a pass
   */
  async updatePass(
    requestParameters: UpdatePassRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<void> {
    await this.updatePassRaw(requestParameters, initOverrides)
  }
}

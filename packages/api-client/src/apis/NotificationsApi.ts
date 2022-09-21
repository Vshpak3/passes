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
  GetNotificationSettingsResponseDto,
  GetNotificationsRequestDto,
  GetNotificationsResponseDto,
  UpdateNotificationSettingsRequestDto,
} from '../models';
import {
    GetNotificationSettingsResponseDtoFromJSON,
    GetNotificationSettingsResponseDtoToJSON,
    GetNotificationsRequestDtoFromJSON,
    GetNotificationsRequestDtoToJSON,
    GetNotificationsResponseDtoFromJSON,
    GetNotificationsResponseDtoToJSON,
    UpdateNotificationSettingsRequestDtoFromJSON,
    UpdateNotificationSettingsRequestDtoToJSON,
} from '../models';

export interface GetNotificationsRequest {
    getNotificationsRequestDto: GetNotificationsRequestDto;
}

export interface ReadNotificationRequest {
    notificationId: string;
}

export interface UpdateNotificationSettingsRequest {
    updateNotificationSettingsRequestDto: UpdateNotificationSettingsRequestDto;
}

/**
 * 
 */
export class NotificationsApi extends runtime.BaseAPI {

    /**
     * Gets notification settings
     */
    async getNotificationSettingsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetNotificationSettingsResponseDto>> {
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
            path: `/api/notifications/settings`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetNotificationSettingsResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets notification settings
     */
    async getNotificationSettings(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetNotificationSettingsResponseDto> {
        const response = await this.getNotificationSettingsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Gets notifications
     */
    async getNotificationsRaw(requestParameters: GetNotificationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetNotificationsResponseDto>> {
        if (requestParameters.getNotificationsRequestDto === null || requestParameters.getNotificationsRequestDto === undefined) {
            throw new runtime.RequiredError('getNotificationsRequestDto','Required parameter requestParameters.getNotificationsRequestDto was null or undefined when calling getNotifications.');
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
            path: `/api/notifications/get`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GetNotificationsRequestDtoToJSON(requestParameters.getNotificationsRequestDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetNotificationsResponseDtoFromJSON(jsonValue));
    }

    /**
     * Gets notifications
     */
    async getNotifications(requestParameters: GetNotificationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetNotificationsResponseDto> {
        const response = await this.getNotificationsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Set status as read
     */
    async readNotificationRaw(requestParameters: ReadNotificationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.notificationId === null || requestParameters.notificationId === undefined) {
            throw new runtime.RequiredError('notificationId','Required parameter requestParameters.notificationId was null or undefined when calling readNotification.');
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
            path: `/api/notifications/read/{notificationId}`.replace(`{${"notificationId"}}`, encodeURIComponent(String(requestParameters.notificationId))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Set status as read
     */
    async readNotification(requestParameters: ReadNotificationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.readNotificationRaw(requestParameters, initOverrides);
    }

    /**
     * Subscribe to notification events
     */
    async subscribeNotificationsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
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
            path: `/api/notifications/subscribe`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Subscribe to notification events
     */
    async subscribeNotifications(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.subscribeNotificationsRaw(initOverrides);
    }

    /**
     * Update notification settings
     */
    async updateNotificationSettingsRaw(requestParameters: UpdateNotificationSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<boolean>> {
        if (requestParameters.updateNotificationSettingsRequestDto === null || requestParameters.updateNotificationSettingsRequestDto === undefined) {
            throw new runtime.RequiredError('updateNotificationSettingsRequestDto','Required parameter requestParameters.updateNotificationSettingsRequestDto was null or undefined when calling updateNotificationSettings.');
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
            path: `/api/notifications/settings`,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateNotificationSettingsRequestDtoToJSON(requestParameters.updateNotificationSettingsRequestDto),
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Update notification settings
     */
    async updateNotificationSettings(requestParameters: UpdateNotificationSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<boolean> {
        const response = await this.updateNotificationSettingsRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

export const NotificationsSecurityInfo = new Set<string>([
    "getNotificationSettings",
    "getNotifications",
    "readNotification",
    "subscribeNotifications",
    "updateNotificationSettings",
])

import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter } from 'events'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { fromEvent } from 'rxjs'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { UserEntity } from '../user/entities/user.entity'
import { GetNotificationsRequestDto } from './dto/get-notification.dto'
import { NotificationDto } from './dto/notification.dto'
import { NotificationSettingsDto } from './dto/notification-settings.dto'
import { UpdateNotificationSettingsRequestDto } from './dto/update-notification-settings.dto'
import { NotificationEntity } from './entities/notification.entity'
import { NotificationSettingsEntity } from './entities/notification-settings.entity'
import { NotificationStatusEnum } from './enum/notification.status.enum'
import { NotificationTypeEnum } from './enum/notification.type.enum'

@Injectable()
export class NotificationsService {
  private readonly emitter: EventEmitter

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
  ) {
    this.emitter = new EventEmitter()
  }

  getEventName(userId: string) {
    return CryptoJS.SHA256(`notifications-${userId}`).toString(CryptoJS.enc.Hex)
  }

  async subscribe(userId: string) {
    return fromEvent(this.emitter, this.getEventName(userId))
  }

  async get(
    userId: string,
    getNotificationsRequest: GetNotificationsRequestDto,
  ): Promise<NotificationDto[]> {
    let query = this.dbReader<NotificationEntity>(NotificationEntity.table)
      .leftJoin(
        UserEntity.table,
        `${NotificationEntity.table}.sender_id`,
        `${UserEntity.table}.id`,
      )
      .select([
        `${NotificationEntity.table}.id as id`,
        `${NotificationEntity.table}.user_id as user_id`,
        `${NotificationEntity.table}.status`,
        `${NotificationEntity.table}.type`,
        `${NotificationEntity.table}.message`,
        `${NotificationEntity.table}.created_at`,
        `${UserEntity.table}.display_name as sender_display_name`,
        `${UserEntity.table}.username as sender_username`,
      ])
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .offset(getNotificationsRequest.offset)
      .limit(getNotificationsRequest.limit)

    if (getNotificationsRequest.type) {
      query = query.andWhere('type', getNotificationsRequest.type)
    }
    const notifications = await query
    return notifications.map(
      (notification) => new NotificationDto(notification),
    )
  }

  async send(
    senderId: string,
    receiverId: string,
    message: string,
    type: NotificationTypeEnum,
  ) {
    const data = {
      id: v4(),
      user_id: receiverId,
      sender_id: senderId,
      message,
      type,
    }
    await this.dbWriter<NotificationEntity>(NotificationEntity.table).insert(
      data,
    )
    const notification = await this.dbReader<NotificationEntity>(
      NotificationEntity.table,
    )
      .leftJoin(
        UserEntity.table,
        `${NotificationEntity.table}.sender_id`,
        `${UserEntity.table}.id`,
      )
      .select([
        `${NotificationEntity.table}.id as id`,
        `${NotificationEntity.table}.user_id`,
        `${NotificationEntity.table}.status`,
        `${NotificationEntity.table}.type`,
        `${NotificationEntity.table}.message`,
        `${NotificationEntity.table}.created_at`,
        `${UserEntity.table}.display_name as sender_display_name`,
        `${UserEntity.table}.username as sender_username`,
      ])
      .where({ id: data.id })
      .first()
    this.emitter.emit(
      this.getEventName('receiverId'),
      new NotificationDto(notification),
    )
  }

  async readNotification(userId: string, notificationId: string) {
    await this.dbWriter<NotificationEntity>(NotificationEntity.table)
      .update({ status: NotificationStatusEnum.READ })
      .where({
        user_id: userId,
        id: notificationId,
      })
  }

  async getNotificationSettings(
    userId: string,
  ): Promise<NotificationSettingsDto> {
    const settings = await this.dbReader<NotificationSettingsEntity>(
      NotificationSettingsEntity.table,
    )
      .where({ user_id: userId })
      .first()
    if (!settings) {
      throw new NotFoundException(
        'Notification settings does not exist for user',
      )
    }
    return new NotificationSettingsDto(settings)
  }

  async updateNotificationSettings(
    userId: string,
    updateSettingsDto: UpdateNotificationSettingsRequestDto,
  ): Promise<boolean> {
    const data = {
      direct_message_emails: updateSettingsDto.directMessageEmails,
      passes_emails: updateSettingsDto.passesEmails,
      payment_emails: updateSettingsDto.paymentEmails,
      post_emails: updateSettingsDto.postEmails,
      marketing_emails: updateSettingsDto.marketingEmails,
      mention_emails: updateSettingsDto.mentionEmails,
    }

    Object.keys(data).forEach((key) =>
      data[key] === undefined ? delete data[key] : {},
    )
    if (Object.keys(data).length === 0) {
      return false
    }

    const updated = await this.dbWriter<NotificationSettingsEntity>(
      NotificationSettingsEntity.table,
    )
      .update(data)
      .where({ user_id: userId })
    return updated === 1
  }
}

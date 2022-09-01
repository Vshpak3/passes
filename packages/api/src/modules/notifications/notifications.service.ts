import { Inject, Injectable } from '@nestjs/common'
import { EventEmitter } from 'events'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { fromEvent } from 'rxjs'
import { v4 } from 'uuid'
import { Logger } from 'winston'

import { Database } from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { UserEntity } from '../user/entities/user.entity'
import { GetNotificationsRequestDto } from './dto/get-notification.dto'
import { NotificationDto } from './dto/notification.dto'
import { NotificationEntity } from './entities/notification.entity'
import { NotificationStatusEnum } from './enum/notification.status.enum'
import { NotificationTypeEnum } from './enum/notification.type.enum'

@Injectable()
export class NotificationsService {
  private readonly emitter: EventEmitter

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    @Database('ReadOnly')
    private readonly dbReader: DatabaseService['knex'],
    @Database('ReadWrite')
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
  ): Promise<Array<NotificationDto>> {
    let query = this.dbReader(NotificationEntity.table)
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
        `${UserEntity.table}.display_name as sender_name`,
        `${UserEntity.table}.username as sender_username`,
      ])
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .offset(getNotificationsRequest.offset)
      .limit(getNotificationsRequest.limit)

    if (getNotificationsRequest.type)
      query = query.andWhere('type', getNotificationsRequest.type)
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
    const data = NotificationEntity.toDict<NotificationEntity>({
      id: v4(),
      user: receiverId,
      sender: senderId,
      message,
      type,
    })
    await this.dbWriter(NotificationEntity.table).insert(data)
    const notification = await this.dbReader(NotificationEntity.table)
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
        `${UserEntity.table}.display_name as sender_name`,
        `${UserEntity.table}.username as sender_username`,
      ])
      .where('id', data.id)
      .first()
    this.emitter.emit(
      this.getEventName('receiverId'),
      new NotificationDto(notification),
    )
  }

  async readNotification(userId: string, notificationId: string) {
    await this.dbWriter(NotificationEntity.table)
      .update('status', NotificationStatusEnum.READ)
      .where(
        NotificationEntity.toDict<NotificationEntity>({
          user: userId,
          id: notificationId,
        }),
      )
  }
}

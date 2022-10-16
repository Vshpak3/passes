import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { uuid4 } from '@sentry/utils'
import { subMinutes } from 'date-fns'
import ms from 'ms'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { MessagesService } from '../messages/messages.service'
import { PostService } from '../post/post.service'
import { GetScheduledEventsRequestDto } from './dto/get-scheduled-events.dto'
import { ScheduledEventDto } from './dto/scheduled-event.dto'
import { UpdateScheduledEventRequestDto } from './dto/update-scheduled-event.dto'
import { UpdateScheduledTimeRequestDto } from './dto/update-scheduled-time.dto'
import { ScheduledEventEntity } from './entities/scheduled-event.entity'
import { ScheduledEventTypeEnum } from './enum/scheduled-event.type.enum'
import { checkScheduledAt } from './scheduled.util'

const MAX_TIME_BUFFER = 5 // minutes
const EXECUTION_TIME_BUFFER = ms('45 minutes')

@Injectable()
export class ScheduledService {
  constructor(
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
    private readonly postService: PostService,
    private readonly messagesService: MessagesService,
  ) {}

  async deleteScheduledEvent(userId: string, scheduledEventId: string) {
    const updated = await this.dbWriter<ScheduledEventEntity>(
      ScheduledEventEntity.table,
    )
      .whereNull('processor')
      .whereNull('deleted_at')
      .andWhere({ user_id: userId, id: scheduledEventId })
      .andWhere('scheduled_at', '>=', subMinutes(new Date(), MAX_TIME_BUFFER))
      .update({ deleted_at: new Date() })
    return updated === 1
  }

  async updateScheduledTime(
    userId,
    updateScheduledTimeRequestDto: UpdateScheduledTimeRequestDto,
  ) {
    const { scheduledEventId, scheduledAt } = updateScheduledTimeRequestDto
    checkScheduledAt(scheduledAt)
    const updated = await this.dbWriter<ScheduledEventEntity>(
      ScheduledEventEntity.table,
    )
      .whereNull('processor')
      .whereNull('deleted_at')
      .andWhere({ user_id: userId, id: scheduledEventId })
      .update({ scheduled_at: scheduledAt })
    return updated === 1
  }

  async getScheduledEvents(
    userId: string,
    getScheduledEventsRequestDto: GetScheduledEventsRequestDto,
  ) {
    const { startDate, endDate } = getScheduledEventsRequestDto

    return (
      await this.dbReader<ScheduledEventEntity>(ScheduledEventEntity.table)
        .andWhere('user_id', userId)
        .where('scheduled_at', '>=', startDate)
        .andWhere('scheduled_at', '<', endDate)
        .whereNull('deleted_at')
        .orderBy('scheduled_at', 'asc')
        .select('*')
    ).map((scheduledEvent) => new ScheduledEventDto(scheduledEvent))
  }

  async updateScheduledEvent(
    userId: string,
    updateScheduledEventRequestDto: UpdateScheduledEventRequestDto,
  ) {
    const { scheduledEventId, type, batchMessage, sendMessage, createPost } =
      updateScheduledEventRequestDto
    let body: any = undefined
    switch (type) {
      case ScheduledEventTypeEnum.CREATE_POST:
        if (!createPost) {
          throw new BadRequestException('create post body is empty')
        }
        await this.postService.validateCreatePost(userId, createPost)
        body = createPost
        break
      case ScheduledEventTypeEnum.SEND_MESSAGE:
        if (!sendMessage) {
          throw new BadRequestException('send message body is empty')
        }
        body = sendMessage
        break
      case ScheduledEventTypeEnum.BATCH_MESSAGE:
        if (!batchMessage) {
          throw new BadRequestException('batch message body is empty')
        }
        body = batchMessage
        break
      default:
        throw new InternalServerErrorException('no type in event')
    }
    const updated = await this.dbWriter<ScheduledEventEntity>(
      ScheduledEventEntity.table,
    )
      .where('id', scheduledEventId)
      .whereNull('processer')
      .whereNull('deleted_at')
      .andWhere('scheduled_at', '<', subMinutes(new Date(), MAX_TIME_BUFFER))
      .update({ body })
    return updated === 1
  }

  async processScheduledEvents() {
    const startTime = Date.now()
    let continuing = false
    do {
      continuing = false
      if (startTime + EXECUTION_TIME_BUFFER < Date.now()) {
        break
      }
      const processor = uuid4()
      const updated = await this.dbWriter<ScheduledEventEntity>(
        ScheduledEventEntity.table,
      )
        .update('processor', processor)
        .whereNull('processor')
        .whereNull('deleted_at')
        .where('processed', false)
        .limit(1)

      if (updated) {
        const event = await this.dbWriter<ScheduledEventEntity>(
          ScheduledEventEntity.table,
        )
          .where({ processor, processed: false })
          .select('*')
          .first()
        if (!event) {
          throw new InternalServerErrorException('no updated event to process')
        }
        switch (event.type) {
          case ScheduledEventTypeEnum.CREATE_POST:
            await this.postService.publishPost(event.user_id, event.body)
            break
          case ScheduledEventTypeEnum.SEND_MESSAGE:
            break
          case ScheduledEventTypeEnum.BATCH_MESSAGE:
            await this.messagesService.publishBatchMessage(
              event.user_id,
              event.body,
            )
            break
          default:
            throw new InternalServerErrorException('no type in event')
        }
        await this.dbWriter<ScheduledEventEntity>(ScheduledEventEntity.table)
          .update('processed', true)
          .where('id', event.id)

        continuing = true
      }
    } while (continuing)
  }
}

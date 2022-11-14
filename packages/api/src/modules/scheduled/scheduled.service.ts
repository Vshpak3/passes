import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { subMinutes } from 'date-fns'
import ms from 'ms'
import { v4 } from 'uuid'

import {
  Database,
  DB_READER,
  DB_WRITER,
} from '../../database/database.decorator'
import { DatabaseService } from '../../database/database.service'
import { OrderEnum } from '../../util/dto/page.dto'
import { ContentService } from '../content/content.service'
import { ListOrderTypeEnum } from '../list/enum/list.order.enum'
import { ListService } from '../list/list.service'
import { MessagesService } from '../messages/messages.service'
import { PassService } from '../pass/pass.service'
import { PostService } from '../post/post.service'
import { SCHEDULE_MINUTE_LIMIT } from './constants/limits'
import { GetScheduledEventsRequestDto } from './dto/get-scheduled-events.dto'
import { ScheduledEventDto } from './dto/scheduled-event.dto'
import { UpdateScheduledEventRequestDto } from './dto/update-scheduled-event.dto'
import { UpdateScheduledTimeRequestDto } from './dto/update-scheduled-time.dto'
import { ScheduledEventEntity } from './entities/scheduled-event.entity'
import { ScheduledEventTypeEnum } from './enum/scheduled-event.type.enum'
import { checkScheduledAt } from './scheduled.util'

const EXECUTION_TIME_BUFFER = ms('45 minutes')
const NO_EVENT_TYPE_ERROR = 'no type in event'
@Injectable()
export class ScheduledService {
  constructor(
    @Database(DB_READER)
    private readonly dbReader: DatabaseService['knex'],
    @Database(DB_WRITER)
    private readonly dbWriter: DatabaseService['knex'],
    private readonly postService: PostService,
    private readonly messagesService: MessagesService,
    private readonly passService: PassService,
    private readonly listService: ListService,
    private readonly contentService: ContentService,
  ) {}

  async deleteScheduledEvent(userId: string, scheduledEventId: string) {
    const updated = await this.dbWriter<ScheduledEventEntity>(
      ScheduledEventEntity.table,
    )
      .whereNull('processor')
      .whereNull('deleted_at')
      .andWhere({ user_id: userId, id: scheduledEventId })
      .andWhere(
        'scheduled_at',
        '>=',
        subMinutes(new Date(), SCHEDULE_MINUTE_LIMIT),
      )
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
    const events = (
      await this.dbReader<ScheduledEventEntity>(ScheduledEventEntity.table)
        .andWhere('user_id', userId)
        .where('scheduled_at', '>=', startDate)
        .andWhere('scheduled_at', '<', endDate)
        .whereNull('deleted_at')
        // Gets events that have been scheduled
        // .andWhere('processed', false)
        .orderBy('scheduled_at', 'asc')
        .select('*')
    ).map((scheduledEvent) => new ScheduledEventDto(scheduledEvent))

    await Promise.all(
      events.map(async (event) => {
        const { type, createPost, sendMessage, batchMessage } = event
        switch (type) {
          case ScheduledEventTypeEnum.CREATE_POST:
            if (!createPost) {
              throw new BadRequestException('create post body is empty')
            }
            await this.postService.validateCreatePost(userId, createPost)
            event.passes = await this.passService.getCreatorPasses(
              {},
              createPost.passIds,
            )
            event.contents = await this.contentService.validateContentIds(
              userId,
              createPost.contentIds,
            )
            break
          case ScheduledEventTypeEnum.SEND_MESSAGE:
            if (!sendMessage) {
              throw new BadRequestException('send message body is empty')
            }
            event.contents = await this.contentService.validateContentIds(
              userId,
              sendMessage.contentIds,
            )
            break
          case ScheduledEventTypeEnum.BATCH_MESSAGE:
            if (!batchMessage) {
              throw new BadRequestException('batch message body is empty')
            }
            event.passes = await this.passService.getCreatorPasses(
              {},
              batchMessage.passIds,
            )
            event.contents = await this.contentService.validateContentIds(
              userId,
              batchMessage.contentIds,
            )
            event.lists = await this.listService.getListsForUser(
              userId,
              {
                order: OrderEnum.DESC,
                orderType: ListOrderTypeEnum.CREATED_AT,
              },
              [...batchMessage.includeListIds, ...batchMessage.excludeListIds],
            )
            break
          default:
            throw new InternalServerErrorException(NO_EVENT_TYPE_ERROR)
        }
      }),
    )
    return events
  }

  async updateScheduledEvent(
    userId: string,
    updateScheduledEventRequestDto: UpdateScheduledEventRequestDto,
  ) {
    const { scheduledEventId, type, batchMessage, sendMessage, createPost } =
      updateScheduledEventRequestDto
    let body: any = undefined
    let scheduledAt: Date | undefined = undefined
    switch (type) {
      case ScheduledEventTypeEnum.CREATE_POST:
        if (!createPost) {
          throw new BadRequestException('create post body is empty')
        }
        await this.postService.validateCreatePost(userId, createPost)
        body = createPost
        scheduledAt = createPost.scheduledAt
        break
      case ScheduledEventTypeEnum.SEND_MESSAGE:
        if (!sendMessage) {
          throw new BadRequestException('send message body is empty')
        }
        body = sendMessage
        scheduledAt = sendMessage.scheduledAt
        break
      case ScheduledEventTypeEnum.BATCH_MESSAGE:
        if (!batchMessage) {
          throw new BadRequestException('batch message body is empty')
        }
        body = batchMessage
        scheduledAt = batchMessage.scheduledAt
        break
      default:
        throw new InternalServerErrorException(NO_EVENT_TYPE_ERROR)
    }
    body = JSON.stringify(body)
    const updated = await this.dbWriter<ScheduledEventEntity>(
      ScheduledEventEntity.table,
    )
      .where('id', scheduledEventId)
      .whereNull('processor')
      .whereNull('deleted_at')
      .andWhere(
        'scheduled_at',
        '>',
        subMinutes(new Date(), SCHEDULE_MINUTE_LIMIT),
      )
      .update(scheduledAt ? { body, scheduled_at: scheduledAt } : { body })
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
      const processor = v4()
      const updated = await this.dbWriter<ScheduledEventEntity>(
        ScheduledEventEntity.table,
      )
        .update('processor', processor)
        .where({ processor: null, deleted_at: null, processed: false })
        .andWhere('scheduled_at', '<', new Date())
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
            // eslint-disable-next-line no-case-declarations
            const postId = await this.postService.publishPost(
              event.user_id,
              event.body,
            )
            await this.postService.checkPostContentProcessed(postId)
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
            throw new InternalServerErrorException(NO_EVENT_TYPE_ERROR)
        }
        await this.dbWriter<ScheduledEventEntity>(ScheduledEventEntity.table)
          .update('processed', true)
          .where('id', event.id)

        continuing = true
      }
    } while (continuing)
  }
}

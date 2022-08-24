import { BatchTask } from '../batch/batch.interface'
import { MessagesService } from '../modules/messages/messages.service'
import { RedisLockService } from '../modules/redisLock/redisLock.service'

/*
 * Executes BatchMessages in chunks
 */
export class BatchMessageTask extends BatchTask {
  async run(): Promise<void> {
    const lockService = await this.app.get(RedisLockService)
    try {
      const messagesService = await this.app.get(MessagesService)
      const lockResult = await lockService.lockOnce(
        BatchMessageTask.toString(),
        3600_000,
      )
      if (!lockResult) {
        this.logger.info(`BatchMessageTask locked, skipping`)
      }

      const batchMessages =
        await messagesService.getBatchMessagesToBeProcessed()

      for (let i = 0; i < batchMessages.length; i++) {
        await messagesService.processBatchMessageChunk(
          batchMessages[i].id,
          batchMessages[i].last_processed_id,
        )
      }
    } catch (err) {
      this.logger.error(`BatchMessageTask failed with error`, err)
    } finally {
      await lockService.unlock(BatchMessageTask.toString())
    }
  }
}

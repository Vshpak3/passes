import { BatchTask } from '../batch/batch.interface'
import { RedisLockService } from '../modules/redisLock/redisLock.service'
import { SolService } from '../modules/sol/sol.service'

/*
 * Executes refreshNftsForWallet for chunks of ETH wallets
 */
export class RefreshSolNftTask extends BatchTask {
  async run(): Promise<void> {
    const lockService = await this.app.get(RedisLockService)
    try {
      const solService = await this.app.get(SolService)
      const lockResult = await lockService.lockOnce(
        RefreshSolNftTask.toString(),
        3600_000,
      )
      if (!lockResult) {
        this.logger.info(`RefreshSolNftTask locked, skipping`)
        return
      }

      const batchSolNftRefresh = await solService.getBatchSolNftRefresh()
      await solService.processBatchSolNftRefreshChunk(
        batchSolNftRefresh.id,
        batchSolNftRefresh.last_processed_id,
      )
    } finally {
      await lockService.unlock(RefreshSolNftTask.toString())
    }
  }
}

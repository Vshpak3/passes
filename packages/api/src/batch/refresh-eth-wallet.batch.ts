import { BatchTask } from '../batch/batch.interface'
import { EthService } from '../modules/eth/eth.service'
import { RedisLockService } from '../modules/redisLock/redisLock.service'

/*
 * Executes refreshNftsForWallet for chunks of ETH wallets
 */
export class RefreshEthWalletTask extends BatchTask {
  async run(): Promise<void> {
    const lockService = await this.app.get(RedisLockService)
    try {
      const ethService = await this.app.get(EthService)
      const lockResult = await lockService.lockOnce(
        RefreshEthWalletTask.toString(),
        3600_000,
      )
      if (!lockResult) {
        this.logger.info(`RefreshEthWalletTask locked, skipping`)
        return
      }

      const batchEthWalletRefresh = await ethService.getBatchEthWalletRefresh()
      await ethService.processBatchWalletRefreshChunk(
        batchEthWalletRefresh.id,
        batchEthWalletRefresh.last_processed_id,
      )
    } finally {
      await lockService.unlock(RefreshEthWalletTask.toString())
    }
  }
}

import { EthService } from '../../modules/eth/eth.service'
import { BatchTask } from '../batch.interface'

/*
 * Executes refreshNftsForWallet for chunks of ETH wallets
 */
export class RefreshEthWalletTask extends BatchTask {
  async run(): Promise<void> {
    await this.app.get(EthService).refreshEthNfts()
  }
}

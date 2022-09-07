import { SolService } from '../../modules/sol/sol.service'
import { BatchTask } from '../batch.interface'

/*
 * Executes refreshNftsForWallet for chunks of ETH wallets
 */
export class RefreshSolNftTask extends BatchTask {
  async run(): Promise<void> {
    await this.app.get(SolService).refreshSolNfts()
  }
}

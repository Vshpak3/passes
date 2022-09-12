import { CreateEarningHistoryTask } from './tasks/create-earning-history.batch'
import { ExampleTask } from './tasks/example.batch'
import { PayoutCreatorsTask } from './tasks/payout-creators.batch'
import { ProcessBlocksTask } from './tasks/process-blocks.batch'
import { RefreshEthWalletTask } from './tasks/refresh-eth-wallet.batch'
import { RefreshPersonasVerificationsTask } from './tasks/refresh-persona-verifications.batch'
import { RefreshSolNftTask } from './tasks/refresh-sol-nft.batch'
import { RefreshStatsTask } from './tasks/refresh-stats.batch'
import { UpdateSubscriptionsTask } from './tasks/update-subscriptions.batch'

// Maps an identifier (to be specified in the job definition) to the batch task
// class to run
export const TaskDirectory = {
  example_task: ExampleTask,
  payout_creators_task: PayoutCreatorsTask,
  update_subscriptions_task: UpdateSubscriptionsTask,
  create_earning_history_task: CreateEarningHistoryTask,
  refresh_eth_wallet_task: RefreshEthWalletTask,
  refresh_sol_nft_task: RefreshSolNftTask,
  refersh_persona_verifications_task: RefreshPersonasVerificationsTask,
  refresh_stats_task: RefreshStatsTask,
  process_blocks_task: ProcessBlocksTask,
}

import { CreateEarningHistoryTask } from './tasks/create-earning-history.batch'
import { FailStalePayinsTask } from './tasks/fail-stale-payins.batch'
import { PayoutCreatorsTask } from './tasks/payout-creators.batch'
import { ProcessBlocksTask } from './tasks/process-blocks.batch'
import { RefreshEthWalletTask } from './tasks/refresh-eth-wallet.batch'
import { RefreshNumPostsTask } from './tasks/refresh-num-posts.batch'
import { RefreshPersonasVerificationsTask } from './tasks/refresh-persona-verifications.batch'
import { RefreshSolNftTask } from './tasks/refresh-sol-nft.batch'
import { RefreshStatsTask } from './tasks/refresh-stats.batch'
import { UpdateSubscriptionsTask } from './tasks/update-subscriptions.batch'

// Maps an identifier (to be specified in the job definition) to the batch task
// class to run
export const TaskDirectory = {
  create_earning_history_task: CreateEarningHistoryTask,
  payout_creators_task: PayoutCreatorsTask,
  process_blocks_task: ProcessBlocksTask,
  refersh_persona_verifications_task: RefreshPersonasVerificationsTask,
  refresh_eth_wallet_task: RefreshEthWalletTask,
  refresh_sol_nft_task: RefreshSolNftTask,
  refresh_stats_task: RefreshStatsTask,
  refresh_num_posts_task: RefreshNumPostsTask,
  update_subscriptions_task: UpdateSubscriptionsTask,
  fail_stale_payins_task: FailStalePayinsTask,
}

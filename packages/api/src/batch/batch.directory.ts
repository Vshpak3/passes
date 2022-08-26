import { ExampleTask } from '../util/example.batch'
import { BatchMessageTask } from './batch-message.batch'
import { CreateEarningHistoryTask } from './create-earning-history.batch'
import { PayoutCreatorsTask } from './payout-creators.batch'
import { RefreshEthWalletTask } from './refresh-eth-wallet.batch'
import { RefreshSolNftTask } from './refresh-sol-nft.batch'
import { UpdateSubscriptionsTask } from './update-subscriptions.batch'

// Maps an identifier (to be specified in the job definition) to the batch task
// class to run
export const TaskDirectory = {
  example_task: ExampleTask,
  batch_message_task: BatchMessageTask,
  payout_creators_task: PayoutCreatorsTask,
  update_subscriptions_task: UpdateSubscriptionsTask,
  create_earning_history_task: CreateEarningHistoryTask,
  refresh_eth_wallet_task: RefreshEthWalletTask,
  refresh_sol_nft_task: RefreshSolNftTask,
}

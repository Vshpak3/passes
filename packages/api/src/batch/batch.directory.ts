import { ExampleTask } from '../util/example.batch'
import { BatchMessageTask } from './batch-message.batch'
import { PayoutCreatorsTask } from './payout-creators.batch'
import { UpdateSubscriptionsTask } from './update-subscriptions.batch'

// Maps an identifier (to be specified in the job definition) to the batch task
// class to run
export const TaskDirectory = {
  example_task: ExampleTask,
  batch_message_task: BatchMessageTask,
  payout_creators_task: PayoutCreatorsTask,
  update_subscriptions: UpdateSubscriptionsTask,
}

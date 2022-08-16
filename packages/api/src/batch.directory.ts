import { exampleTask } from './util/example.batch'
import { examplePrint } from './util/print.batch'

// Maps an identifier (to be specified in the job definition) to the function to run
export const TaskDirectory = {
  example_task: exampleTask,
  print_test: examplePrint,
}

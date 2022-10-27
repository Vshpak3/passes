import { infra_config_node_env } from '../config/config.options'

type Env = 'dev' | 'stage' | 'prod'

// Special function to avoid needing to use the config service
// everywhere for environment checks.
export function isEnv(env: Env): boolean {
  return infra_config_node_env === env
}

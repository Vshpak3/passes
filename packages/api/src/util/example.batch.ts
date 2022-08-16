import { NotFoundException } from '@nestjs/common'

import { BatchTask } from '../batch/batch.interface'
import { ProfileService } from '../modules/profile/profile.service'

/*
 * A simple example task for testing. Takes a single input, a username, and
 * returns the profile for this username.
 */
export class ExampleTask extends BatchTask {
  async run(username: string): Promise<void> {
    try {
      const profile = await this.app
        .get(ProfileService)
        .findOneByUsername(username)
      this.logger.info(
        `For '${username}' found profile ${JSON.stringify(profile)}`,
      )
    } catch (err) {
      if (!(err instanceof NotFoundException)) {
        throw err
      }
      this.logger.info(`Found no profile for user with username '${username}'`)
    }
  }
}

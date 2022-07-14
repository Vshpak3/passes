import { Request } from '@nestjs/common'

export type RequestWithUser = Request & { user: { id: string } }

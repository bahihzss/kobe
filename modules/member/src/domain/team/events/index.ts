import { TeamCreated } from '@domain/team/events/team-created'
import { BaseUlid } from '@kobe/common/domain'

export type TeamEvent = TeamCreated

export class TeamEventId extends BaseUlid {
  type = 'TeamEventId' as const
}

export * from './team-created'

import { TeamCreated } from '@domain/team/events/team-created'
import { TeamMemberAdded } from '@domain/team/events/team-member-added'
import { BaseUlid } from '@kobe/common/domain'

export type TeamEvent = TeamCreated | TeamMemberAdded

export class TeamEventId extends BaseUlid {
  type = 'TeamEventId' as const
}

export * from './team-created'
export * from './team-member-added'

import { TeamEventId } from '@domain/team/events'
import { TeamId, TeamName } from '@domain/team/models'
import { TeamMembers } from '@domain/team/models/team-members'
import { IEvent } from '@kobe/common/domain'

export class TeamCreated implements IEvent {
  public readonly id: TeamEventId = new TeamEventId()
  public readonly teamId: TeamId = new TeamId()
  public readonly createdAt: Date = new Date()

  constructor(public readonly name: TeamName, public readonly members: TeamMembers) {}

  serialize() {
    return {
      type: 'TeamCreated' as const,
      payload: {
        id: this.id.value,
        teamId: this.teamId.value,
        name: this.name.value,
        members: this.members.serialize(),
        createdAt: this.createdAt,
      },
    }
  }
}

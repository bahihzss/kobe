import { TeamEventId } from '@domain/team/events'
import { TeamId, TeamName } from '@domain/team/models'
import { TeamMembers } from '@domain/team/models/team-members'
import { IEvent } from '@kobe/common/domain'

export class TeamCreated implements IEvent {
  public readonly id: TeamEventId
  public readonly teamId: TeamId
  public readonly createdAt: Date

  constructor(public readonly name: TeamName, public readonly members: TeamMembers) {
    this.id = new TeamEventId()
    this.teamId = new TeamId()
    this.createdAt = new Date()
  }

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

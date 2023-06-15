import { ParticipantId } from '@domain/participant/models'
import { TeamId } from '@domain/team/models'
import { IEvent } from '@kobe/common/domain'

export class TeamMemberAdded implements IEvent {
  public readonly id = new TeamId()
  public readonly addedAt: Date = new Date()

  constructor(public readonly teamId: TeamId, public readonly newMemberId: ParticipantId) {}

  serialize() {
    return {
      type: 'TeamMemberAdded' as const,
      payload: {
        id: this.id.value,
        teamId: this.teamId.value,
        newMemberId: this.newMemberId.value,
        addedAt: this.addedAt,
      },
    }
  }
}

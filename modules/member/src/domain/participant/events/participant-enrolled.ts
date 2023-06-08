import { ParticipantEventId } from '@domain/participant/events'
import { ParticipantId, ParticipantName } from '@domain/participant/models'
import { IEvent } from '@kobe/common/domain'

export class ParticipantEnrolled implements IEvent {
  public readonly id: ParticipantEventId
  public readonly enrolledAt: Date

  constructor(public readonly participantId: ParticipantId, public name: ParticipantName) {
    this.id = new ParticipantEventId()
    this.enrolledAt = new Date()
  }

  serialize() {
    return {
      type: 'ParticipantEnrolled' as const,
      payload: {
        id: this.id.value,
        participantId: this.participantId.value,
        name: this.name.value,
        enrolledAt: this.enrolledAt,
      },
    }
  }
}

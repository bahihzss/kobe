import { ParticipantEventId } from '@domain/participant/events'
import { ParticipantEmail, ParticipantId, ParticipantName } from '@domain/participant/models'
import { ParticipantStatus } from '@domain/participant/models/participant-status'
import { IEvent } from '@kobe/common/domain'

export class ParticipantEnrolled implements IEvent {
  public readonly id: ParticipantEventId
  public readonly enrolledAt: Date

  constructor(public participantId: ParticipantId, public name: ParticipantName, public email: ParticipantEmail) {
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
        email: this.email.value,
        enrolledAt: this.enrolledAt,
      },
    }
  }
}

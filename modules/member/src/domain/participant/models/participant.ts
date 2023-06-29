import { ParticipantEnrolled } from '@domain/participant/events'
import { ParticipantEmail, ParticipantId, ParticipantName } from '@domain/participant/models'
import { ParticipantStatus } from '@domain/participant/models/participant-status'
import { IEntity } from '@kobe/common/domain'

export class Participant implements IEntity {
  private constructor(
    private readonly id: ParticipantId,
    private readonly name: ParticipantName,
    private readonly email: ParticipantEmail,
    private readonly status: ParticipantStatus,
  ) {}

  static enroll(args: { name: ParticipantName; email: ParticipantEmail }) {
    const participantEnrolledEvent = new ParticipantEnrolled(new ParticipantId(), args.name, args.email)
    const participant = this.prototype.onEnrolled(participantEnrolledEvent)

    return [participant, participantEnrolledEvent] as const
  }
  onEnrolled(event: ParticipantEnrolled) {
    return new Participant(event.participantId, event.name, event.email, ParticipantStatus.enrolled)
  }

  equals(other: Participant): boolean {
    return this.id.equals(other.id)
  }

  static reconstruct(args: {
    id: ParticipantId
    name: ParticipantName
    email: ParticipantEmail
    status: ParticipantStatus
  }) {
    return new Participant(args.id, args.name, args.email, args.status)
  }

  serialize() {
    return {
      id: this.id.value,
      name: this.name.value,
      email: this.email.value,
      status: this.status.value,
    }
  }
}

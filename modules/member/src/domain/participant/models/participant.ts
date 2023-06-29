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

  static enroll(args: { name: ParticipantName }) {
    const participantEnrolledEvent = new ParticipantEnrolled(
      new ParticipantId(),
      args.name,
      new ParticipantEmail('info@example.com'),
    )
    const participant = this.prototype.onEnrolled(participantEnrolledEvent)

    return [participant, participantEnrolledEvent] as const
  }
  onEnrolled(event: ParticipantEnrolled) {
    return new Participant(event.participantId, event.name, event.email, ParticipantStatus.enrolled)
  }

  equals(other: Participant): boolean {
    return this.id.equals(other.id)
  }

  static reconstruct(args: { id: ParticipantId; name: ParticipantName }) {
    return new Participant(args.id, args.name, new ParticipantEmail('info@example.com'), ParticipantStatus.enrolled)
  }

  serialize() {
    return {
      id: this.id.value,
      name: this.name.value,
    }
  }
}

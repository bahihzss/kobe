import { ParticipantEnrolled } from '@domain/participant/events'
import { ParticipantId, ParticipantName } from '@domain/participant/models'
import { IEntity } from '@kobe/common/domain'

export class Participant implements IEntity {
  private constructor(private readonly id: ParticipantId, private readonly name: ParticipantName) {}

  static enroll(args: { name: ParticipantName }) {
    const id = new ParticipantId()

    const participantEnrolledEvent = new ParticipantEnrolled(id, args.name)
    const participant = this.prototype.onEnrolled(participantEnrolledEvent)

    return [participant, participantEnrolledEvent] as const
  }
  onEnrolled(event: ParticipantEnrolled) {
    return new Participant(event.participantId, event.name)
  }

  equals(other: Participant): boolean {
    return this.id.equals(other.id)
  }

  static reconstruct(args: { id: ParticipantId; name: ParticipantName }) {
    return new Participant(args.id, args.name)
  }

  serialize() {
    return {
      id: this.id.value,
      name: this.name.value,
    }
  }
}

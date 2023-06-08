import { BaseUlid } from '@common/value/base-ulid.value'
import { ParticipantEnrolledEvent } from '@/member/domain/participant/participant-enrolled.event'

export class ParticipantId extends BaseUlid {}

export class Participant {
  private constructor(
    private readonly id: ParticipantId,
    private readonly name: string,
  ) {}

  static enroll(args: { name: string }) {
    const id = new ParticipantId()

    const participant = new Participant(id, args.name)
    const participantEnrolledEvent = new ParticipantEnrolledEvent(id, args.name)

    return [participant, participantEnrolledEvent] as const
  }

  get snapshot() {
    return {
      id: this.id,
      name: this.name,
    }
  }
}

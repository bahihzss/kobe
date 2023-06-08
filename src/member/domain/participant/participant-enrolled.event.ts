import { ParticipantId } from '@/member/domain/participant/participant.entity'
import {
  ParticipantEvent,
  ParticipantEventId,
} from '@/member/domain/participant/participant.event'

export class ParticipantEnrolledEvent implements ParticipantEvent {
  public readonly id: ParticipantEventId
  constructor(
    public readonly participantId: ParticipantId,
    public name: string,
  ) {
    this.id = new ParticipantEventId()
  }
}

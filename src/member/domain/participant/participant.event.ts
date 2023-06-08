import { BaseUlid } from '@common/value/base-ulid.value'
import { ParticipantId } from '@/member/domain/participant/participant.entity'

export class ParticipantEventId extends BaseUlid {
  private type = 'ParticipantEvent'
}

export interface ParticipantEvent {
  id: ParticipantEventId
  participantId: ParticipantId
}

import { Participant } from './participant.entity'
import { ParticipantEvent } from '@/member/domain/participant/participant.event'

export interface ParticipantRepository {
  store(
    participant: Participant,
    participantEvent: ParticipantEvent,
  ): Promise<void>
}

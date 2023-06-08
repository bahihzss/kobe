import { ParticipantEvent } from '@domain/participant/events'
import { Participant, ParticipantId } from '@domain/participant/models'

export interface ParticipantRepository {
  store(participant: Participant, participantEvent: ParticipantEvent): Promise<void>

  findById(participantId: ParticipantId): Promise<Participant | undefined>
}

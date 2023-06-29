import { ParticipantEvent } from '@domain/participant/events'
import { Participant, ParticipantEmail, ParticipantId } from '@domain/participant/models'

export interface ParticipantRepository {
  store(participant: Participant, participantEvent: ParticipantEvent): Promise<void>

  findById(participantId: ParticipantId): Promise<Participant | undefined>

  findByEmail(email: ParticipantEmail): Promise<Participant | undefined>
}

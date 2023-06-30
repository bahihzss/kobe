import { Participant } from '@domain/participant/participant'

export interface ParticipantRepository {
  save(participant: Participant): Promise<void>
}

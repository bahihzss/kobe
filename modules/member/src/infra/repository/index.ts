import { ParticipantFirestoreRepository } from '@infra/repository/participant.firestore.repository'
import { TeamFirestoreRepository } from '@infra/repository/team.firestore.repository'
import { Token } from '@root/token'

export * from './participant.in-memory.repository'
export * from './participant.firestore.repository'
export * from './participant.mock.repository'
export * from './team.in-memory.repository'
export * from './team.firestore.repository'
export * from './pair.in-memory.repository'

export const repositories = [
  {
    provide: Token.ParticipantRepository,
    useClass: ParticipantFirestoreRepository,
  },
  {
    provide: Token.TeamRepository,
    useClass: TeamFirestoreRepository,
  },
]

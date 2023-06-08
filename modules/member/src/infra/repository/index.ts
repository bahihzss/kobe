export * from './participant.firestore.repository'
export * from './participant.mock.repository'
export * from './team.in-memory.repository'
export * from './pair.in-memory.repository'

import { ParticipantFirestoreRepository } from '@infra/repository/participant.firestore.repository'
import { TeamInMemoryRepository } from '@infra/repository/team.in-memory.repository'
import { Token } from '@root/token'

export const repositories = [
  {
    provide: Token.ParticipantRepository,
    useClass: ParticipantFirestoreRepository,
  },
  {
    provide: Token.TeamRepository,
    useClass: TeamInMemoryRepository,
  },
]

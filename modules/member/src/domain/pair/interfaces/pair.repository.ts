import { PairEvent } from '@domain/pair/events'
import { Pair, PairId } from '@domain/pair/models'
import { TeamId } from '@domain/team/models'

export interface PairRepository {
  store(pair: Pair, pairEvent: PairEvent): Promise<void>
  findById(pairId: PairId): Promise<Pair | undefined>
  findLatest(teamId: TeamId): Promise<Pair | undefined>
}

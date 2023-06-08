/* istanbul ignore file */

import { PairRepository } from '@domain/pair/interfaces'
import { Pair, PairId } from '@domain/pair/models'
import { TeamId } from '@domain/team/models'

export class PairInMemoryRepository implements PairRepository {
  constructor(public pairs: Pair[] = []) {}

  async store(pair: Pair) {
    this.pairs.push(pair)
  }

  async findById(pairId: PairId) {
    return this.pairs.find((pair) => pair.serialize().id === pairId.value)
  }

  async findLatest(teamId: TeamId) {
    const pairsInTeam = this.pairs.filter((pair) => pair.serialize().teamId === teamId.value)
    return this.pairs.slice(-1)[0]
  }
}

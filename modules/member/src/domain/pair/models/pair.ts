import { PairCreated } from '@domain/pair/events'
import { PairId, PairName } from '@domain/pair/models'
import { TeamId } from '@domain/team/models'
import { IEntity } from '@kobe/common/domain'

export class Pair implements IEntity {
  private constructor(private readonly id: PairId, private readonly name: PairName, private readonly teamId: TeamId) {}

  static create(teamId: TeamId, latestPair?: Pair) {
    const pairName = latestPair ? latestPair.name.next : PairName.first

    const event = new PairCreated(pairName, teamId)
    const pair = this.prototype.onCreated(event)

    return [pair, event] as const
  }

  onCreated(event: PairCreated): Pair {
    return new Pair(event.pairId, event.name, event.teamId)
  }

  equals(other: Pair): boolean {
    return this.id.equals(other.id)
  }

  static reconstruct({ id, name, teamId }: { id: PairId; name: PairName; teamId: TeamId }): Pair {
    return new Pair(id, name, teamId)
  }

  serialize() {
    return {
      id: this.id.value,
      name: this.name.value,
      teamId: this.teamId.value,
    }
  }
}

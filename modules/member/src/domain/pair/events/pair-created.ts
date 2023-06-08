import { PairEventId } from '@domain/pair/events/index'
import { PairId, PairName } from '@domain/pair/models'
import { TeamId } from '@domain/team/models'
import { IEvent } from '@kobe/common/domain'

export class PairCreated implements IEvent {
  public readonly id: PairEventId
  public readonly pairId: PairId
  public readonly createdAt: Date

  constructor(public readonly name: PairName, public readonly teamId: TeamId) {
    this.id = new PairEventId()
    this.pairId = new PairId()
    this.createdAt = new Date()
  }

  serialize() {
    return {
      type: 'PairCreated',
      payload: {
        id: this.id.value,
        pairId: this.pairId.value,
        name: this.name.value,
        teamId: this.teamId.value,
        createdAt: this.createdAt,
      },
    }
  }
}

import { PairId } from '@domain/pair/models'
import { ParticipantId } from '@domain/participant/models'
import { IEvent } from '@kobe/common/domain'

export class PairMemberAdded implements IEvent {
  public readonly id = new PairId()
  public readonly addedAt: Date = new Date()

  constructor(public readonly pairId: PairId, public readonly newMemberId: ParticipantId) {}

  serialize() {
    return {
      type: 'PairMemberAdded' as const,
      payload: {
        id: this.id.value,
        pairId: this.pairId.value,
        newMemberId: this.newMemberId.value,
        addedAt: this.addedAt,
      },
    }
  }
}

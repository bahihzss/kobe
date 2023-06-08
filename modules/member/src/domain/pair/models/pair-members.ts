import { ParticipantId } from '@domain/participant/models'
import { DomainException } from '@kobe/common/domain'
import { ICollection } from '@kobe/common/domain/type/collection.interface'

export class PairMembers implements ICollection<ParticipantId> {
  readonly type = 'PairMembers' as const

  private static MIN_MEMBERS_COUNT = 2
  private static MAX_MEMBERS_COUNT = 3

  constructor(private readonly memberIds: ParticipantId[]) {
    this.validate()
  }

  private validate() {
    if (this.count < PairMembers.MIN_MEMBERS_COUNT) {
      throw new DomainException(`メンバー数は最低 ${PairMembers.MIN_MEMBERS_COUNT} 人必要です`)
    }

    if (this.count > PairMembers.MAX_MEMBERS_COUNT) {
      throw new DomainException(`メンバー数は最大 ${PairMembers.MAX_MEMBERS_COUNT} 人までです`)
    }

    if (this.count !== new Set(this.memberIds).size) {
      throw new DomainException('重複した参加者がいます')
    }
  }

  add(memberId: ParticipantId) {
    return new PairMembers([...this.memberIds, memberId])
  }

  remove(memberId: ParticipantId) {
    if (!this.includes(memberId)) {
      throw new DomainException(`${memberId.value} は在籍していません`)
    }

    return new PairMembers(this.memberIds.filter((id) => id.value !== memberId.value))
  }

  private includes(memberId: ParticipantId) {
    return this.memberIds.some((id) => id.value === memberId.value)
  }

  private get count() {
    return this.memberIds.length
  }

  serialize() {
    return this.memberIds.map((member) => member.value)
  }
}

import { ParticipantId } from '@domain/participant/models'
import { DomainException } from '@kobe/common/domain/error'
import { ICollection } from '@kobe/common/domain/type/collection.interface'

export class TeamMembers implements ICollection<ParticipantId> {
  readonly type = 'TeamMembers' as const

  private static readonly MIN_MEMBERS_COUNT = 3

  constructor(private memberIds: ParticipantId[] = []) {
    this.validate()
  }

  private validate() {
    if (this.count < TeamMembers.MIN_MEMBERS_COUNT) {
      throw new DomainException(`メンバー数は最低 ${TeamMembers.MIN_MEMBERS_COUNT} 人必要です`)
    }

    if (this.count !== new Set(this.memberIds).size) {
      throw new DomainException('重複した参加者がいます')
    }
  }

  add(newMemberId: ParticipantId) {
    return new TeamMembers([...this.memberIds, newMemberId])
  }

  remove(leavingMemberId: ParticipantId) {
    if (!this.includes(leavingMemberId)) {
      throw new DomainException(`${leavingMemberId.value} は在籍していません`)
    }

    return new TeamMembers(this.memberIds.filter((memberId) => !memberId.equals(leavingMemberId)))
  }

  compareWith(other: TeamMembers) {
    return this.count - other.count
  }

  hasSameCount(other: TeamMembers) {
    return this.count === other.count
  }

  private get count() {
    return this.memberIds.length
  }

  private includes(participantId: ParticipantId) {
    return this.memberIds.some((memberId) => memberId.equals(participantId))
  }

  serialize() {
    return this.memberIds.map((memberId) => memberId.value)
  }
}

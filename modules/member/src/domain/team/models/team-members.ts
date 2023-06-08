import { ParticipantId } from '@domain/participant/models'
import { DomainException } from '@kobe/common/domain/error'
import { ICollection } from '@kobe/common/domain/type/collection.interface'

export class TeamMembers implements ICollection<ParticipantId> {
  readonly type = 'TeamMembers'

  private static readonly MIN_COUNT = 3

  constructor(private memberIds: ParticipantId[] = []) {}

  static create(memberIds: ParticipantId[]) {
    if (memberIds.length < TeamMembers.MIN_COUNT) {
      throw new DomainException(`メンバー数は最低 ${TeamMembers.MIN_COUNT} 人必要です`)
    }

    return new TeamMembers(memberIds)
  }

  get count() {
    return this.memberIds.length
  }

  add(newMemberId: ParticipantId) {
    return new TeamMembers([...this.memberIds, newMemberId])
  }

  remove(leavingMemberId: ParticipantId) {
    switch (true) {
      case !this.includes(leavingMemberId):
        throw new DomainException(`${leavingMemberId.value} は在籍していないです`)
      case this.isMin():
        throw new DomainException(`メンバー数が ${TeamMembers.MIN_COUNT} 人を下回ってしまいます`)
    }

    return new TeamMembers(this.memberIds.filter((memberId) => !memberId.equals(leavingMemberId)))
  }

  private includes(participantId: ParticipantId) {
    return this.memberIds.some((memberId) => memberId.equals(participantId))
  }

  private isMin() {
    return this.count === TeamMembers.MIN_COUNT
  }

  serialize() {
    return this.memberIds.map((memberId) => memberId.value)
  }
}

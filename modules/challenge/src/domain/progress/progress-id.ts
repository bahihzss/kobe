import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { IValue } from '@kobe/common/domain'

export class ProgressId implements IValue<string> {
  type = 'ProgressId' as const

  constructor(public readonly value: string) {}

  static compositeFrom(challengeId: ChallengeId, assigneeId: ParticipantId) {
    return new ProgressId(`${challengeId.value}-${assigneeId.value}`)
  }

  get challengeId() {
    return new ChallengeId(this.value.split('-')[0])
  }

  get assigneeId() {
    return new ParticipantId(this.value.split('-')[1])
  }

  equals(other: ProgressId) {
    return this.value === other.value && this.type === other.type
  }
}

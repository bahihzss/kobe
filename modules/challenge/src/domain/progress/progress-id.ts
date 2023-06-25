import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { IValue } from '@kobe/common/domain'

export class ProgressId implements IValue<string> {
  type = 'ProgressId' as const

  readonly value: string

  constructor(challengeId: ChallengeId, assigneeId: ParticipantId) {
    this.value = `${challengeId.value}-${assigneeId.value}`
  }

  equals(other: ProgressId) {
    return this.value === other.value && this.type === other.type
  }
}

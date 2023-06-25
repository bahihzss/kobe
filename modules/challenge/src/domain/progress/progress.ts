import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { ProgressId } from '@domain/progress/progress-id'
import { ProgressInvalidOperatorException } from '@domain/progress/progress-invalid-operator.exception'
import { ProgressStatus } from '@domain/progress/progress-status'
import { IEntity } from '@kobe/common/domain'

export class Progress implements IEntity {
  private constructor(
    private readonly status: ProgressStatus,
    private readonly assigneeId: ParticipantId,
    private readonly challengeId: ChallengeId,
  ) {}

  get id() {
    return new ProgressId(this.challengeId, this.assigneeId)
  }

  static assign(params: { challengeId: ChallengeId; assigneeId: ParticipantId }) {
    return new Progress(ProgressStatus.todo, params.assigneeId, params.challengeId)
  }

  start(params: { operatorId: ParticipantId }) {
    if (!this.assigneeId.equals(params.operatorId)) {
      throw new ProgressInvalidOperatorException()
    }

    return new Progress(this.status.start(), this.assigneeId, this.challengeId)
  }

  requestReview(params: { operatorId: ParticipantId }) {
    if (!this.assigneeId.equals(params.operatorId)) {
      throw new ProgressInvalidOperatorException()
    }

    return new Progress(this.status.requestReview(), this.assigneeId, this.challengeId)
  }

  complete(params: { operatorId: ParticipantId }) {
    if (!this.assigneeId.equals(params.operatorId)) {
      throw new ProgressInvalidOperatorException()
    }

    return new Progress(this.status.complete(), this.assigneeId, this.challengeId)
  }

  static reconstruct(params: { challengeId: ChallengeId; assigneeId: ParticipantId; status: ProgressStatus }) {
    return new Progress(params.status, params.assigneeId, params.challengeId)
  }

  serialize() {
    return {
      status: this.status.value,
      assigneeId: this.assigneeId.value,
      challengeId: this.challengeId.value,
    }
  }
}

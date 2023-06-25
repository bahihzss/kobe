import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { ProgressId } from '@domain/progress/progress-id'
import { ProgressInvalidOperatorException } from '@domain/progress/progress-invalid-operator.exception'
import { ProgressStatus } from '@domain/progress/progress-status'
import { IEntity } from '@kobe/common/domain'

export class Progress implements IEntity {
  private constructor(
    private readonly id: ProgressId,
    private readonly status: ProgressStatus,
    private readonly assigneeId: ParticipantId,
    private readonly challengeId: ChallengeId,
  ) {}

  static assign(param: { challengeId: ChallengeId; assigneeId: ParticipantId }) {
    return new Progress(new ProgressId(), ProgressStatus.todo, param.assigneeId, param.challengeId)
  }

  start(params: { operatorId: ParticipantId }) {
    if (!this.assigneeId.equals(params.operatorId)) {
      throw new ProgressInvalidOperatorException()
    }

    return new Progress(this.id, this.status.start(), this.assigneeId, this.challengeId)
  }

  requestReview(params: { operatorId: ParticipantId }) {
    if (!this.assigneeId.equals(params.operatorId)) {
      throw new ProgressInvalidOperatorException()
    }

    return new Progress(this.id, this.status.requestReview(), this.assigneeId, this.challengeId)
  }

  complete(params: { operatorId: ParticipantId }) {
    if (!this.assigneeId.equals(params.operatorId)) {
      throw new ProgressInvalidOperatorException()
    }

    return new Progress(this.id, this.status.complete(), this.assigneeId, this.challengeId)
  }

  static reconstruct(param: {
    challengeId: ChallengeId
    id: ProgressId
    assigneeId: ParticipantId
    status: ProgressStatus
  }) {
    return new Progress(param.id, param.status, param.assigneeId, param.challengeId)
  }

  serialize() {
    return {
      id: this.id.value,
      status: this.status.value,
      assigneeId: this.assigneeId.value,
      challengeId: this.challengeId.value,
    }
  }
}

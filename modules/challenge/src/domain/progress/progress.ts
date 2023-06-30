import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { ProgressId } from '@domain/progress/progress-id'
import { ProgressInvalidOperatorException } from '@domain/progress/progress-invalid-operator.exception'
import { ProgressStatus } from '@domain/progress/progress-status'
import { IEntity } from '@kobe/common/domain'

export class Progress implements IEntity {
  private constructor(
    public readonly id: ProgressId,
    private readonly status: ProgressStatus,
    private readonly assigneeId: ParticipantId,
    private readonly challengeId: ChallengeId,
  ) {}

  static create(params: { challengeId: ChallengeId; assigneeId: ParticipantId }) {
    const id = ProgressId.compositeFrom(params.challengeId, params.assigneeId)
    return new Progress(id, ProgressStatus.todo, params.assigneeId, params.challengeId)
  }

  start(params: { operatorId: ParticipantId }) {
    return this.changeStatus(params.operatorId, this.status.start())
  }

  requestReview(params: { operatorId: ParticipantId }) {
    return this.changeStatus(params.operatorId, this.status.requestReview())
  }

  complete(params: { operatorId: ParticipantId }) {
    return this.changeStatus(params.operatorId, this.status.complete())
  }

  private changeStatus(operatorId: ParticipantId, toStatus: ProgressStatus) {
    if (!this.assigneeId.equals(operatorId)) {
      throw new ProgressInvalidOperatorException()
    }

    return new Progress(this.id, toStatus, this.assigneeId, this.challengeId)
  }

  static reconstruct(params: { challengeId: ChallengeId; assigneeId: ParticipantId; status: ProgressStatus }) {
    const id = ProgressId.compositeFrom(params.challengeId, params.assigneeId)
    return new Progress(id, params.status, params.assigneeId, params.challengeId)
  }

  serialize() {
    return {
      status: this.status.value,
      assigneeId: this.assigneeId.value,
      challengeId: this.challengeId.value,
    }
  }
}

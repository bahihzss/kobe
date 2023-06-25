import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { ProgressRepository } from '@domain/progress'

interface RequestReviewUseCaseParams {
  challengeId: string
  assigneeId: string
}

export class RequestReviewUseCase {
  constructor(private readonly progressRepository: ProgressRepository) {}

  async execute(params: RequestReviewUseCaseParams): Promise<void> {
    const challengeId = new ChallengeId(params.challengeId)
    const assigneeId = new ParticipantId(params.assigneeId)

    const progress = await this.progressRepository.findByChallengeAndAssignee({
      challengeId,
      assigneeId,
    })
    const requestedProgress = progress.requestReview({ operatorId: assigneeId })
    await this.progressRepository.save(requestedProgress)
  }
}

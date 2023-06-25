import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { ProgressRepository } from '@domain/progress'

interface CompleteChallengeUseCaseParams {
  challengeId: string
  assigneeId: string
}

export class CompleteChallengeUseCase {
  constructor(private readonly progressRepository: ProgressRepository) {}

  async execute(params: CompleteChallengeUseCaseParams): Promise<void> {
    const challengeId = new ChallengeId(params.challengeId)
    const assigneeId = new ParticipantId(params.assigneeId)

    const progress = await this.progressRepository.findByChallengeAndAssignee({
      challengeId,
      assigneeId,
    })
    const completedProgress = progress.complete({ operatorId: assigneeId })
    await this.progressRepository.save(completedProgress)
  }
}

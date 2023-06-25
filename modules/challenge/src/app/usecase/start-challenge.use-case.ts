import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { ProgressRepository } from '@domain/progress'

interface StartChallengeUseCaseParams {
  challengeId: string
  assigneeId: string
}

export class StartChallengeUseCase {
  constructor(private readonly progressRepository: ProgressRepository) {}

  async execute(params: StartChallengeUseCaseParams): Promise<void> {
    const challengeId = new ChallengeId(params.challengeId)
    const assigneeId = new ParticipantId(params.assigneeId)

    const progress = await this.progressRepository.findByChallengeAndAssignee({
      challengeId,
      assigneeId,
    })
    const startedProgress = progress.start({ operatorId: assigneeId })
    await this.progressRepository.save(startedProgress)
  }
}

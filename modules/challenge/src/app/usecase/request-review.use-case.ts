import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { ProgressRepository } from '@domain/progress'
import { UseCaseException } from '@kobe/common/app/error/use-case-exception.error'
import { Inject, Injectable } from '@nestjs/common'
import { Token } from '@root/token'

interface RequestReviewUseCaseParams {
  challengeId: string
  assigneeId: string
}

@Injectable()
export class RequestReviewUseCase {
  constructor(
    @Inject(Token.ProgressRepository)
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute(params: RequestReviewUseCaseParams): Promise<void> {
    const challengeId = new ChallengeId(params.challengeId)
    const assigneeId = new ParticipantId(params.assigneeId)

    const progress = await this.progressRepository.findByChallengeAndAssignee({
      challengeId,
      assigneeId,
    })

    if (!progress) {
      throw new UseCaseException('指定された課題の進捗が見つかりませんでした。')
    }

    const requestedProgress = progress.requestReview({ operatorId: assigneeId })
    await this.progressRepository.save(requestedProgress)
  }
}

import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { ProgressRepository } from '@domain/progress'
import { ProgressId } from '@domain/progress/progress-id'
import { UseCaseException } from '@kobe/common/app/error/use-case-exception.error'
import { Inject, Injectable } from '@nestjs/common'
import { Token } from '@root/token'

interface CompleteChallengeUseCaseParams {
  challengeId: string
  assigneeId: string
}

@Injectable()
export class CompleteChallengeUseCase {
  constructor(
    @Inject(Token.ProgressRepository)
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute(params: CompleteChallengeUseCaseParams): Promise<void> {
    const challengeId = new ChallengeId(params.challengeId)
    const assigneeId = new ParticipantId(params.assigneeId)
    const progressId = ProgressId.compositeFrom(challengeId, assigneeId)

    const progress = await this.progressRepository.findById(progressId)
    if (!progress) {
      throw new UseCaseException('指定された課題の進捗が見つかりませんでした。')
    }

    const completedProgress = progress.complete({ operatorId: assigneeId })
    await this.progressRepository.update(completedProgress)
  }
}

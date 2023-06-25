import { ListProgressesQueryService } from '@app/query-service/list-progresses.query-service'
import { ChallengeId } from '@domain/challenge'
import { ProgressStatus } from '@domain/progress'
import { Inject, Injectable } from '@nestjs/common'
import { Token } from '@root/token'

interface ListProgressesUseCaseParams {
  challengeIds: string[]
  status: string
  page: number
}

@Injectable()
export class ListProgressesUseCase {
  constructor(
    @Inject(Token.ListProgressQueryService)
    private listProgressQueryService: ListProgressesQueryService,
  ) {}

  execute(params: ListProgressesUseCaseParams) {
    return this.listProgressQueryService.list({
      challengeIds: params.challengeIds.map((challengeId) => new ChallengeId(challengeId)),
      status: new ProgressStatus(params.status),
      page: params.page,
    })
  }
}

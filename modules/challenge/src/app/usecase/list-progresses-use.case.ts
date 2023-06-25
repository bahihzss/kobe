import { ListProgressesQueryService } from '@app/query-service/list-progresses.query-service'
import { ChallengeId } from '@domain/challenge'
import { ProgressStatus } from '@domain/progress'

interface ListProgressesUseCaseParams {
  challengeIds: string[]
  status: string
  page: number
}

export class ListProgressesUseCase {
  constructor(private listProgressQueryService: ListProgressesQueryService) {}

  execute(params: ListProgressesUseCaseParams) {
    return this.listProgressQueryService.list({
      challengeIds: params.challengeIds.map((challengeId) => new ChallengeId(challengeId)),
      status: new ProgressStatus(params.status),
      page: params.page,
    })
  }
}

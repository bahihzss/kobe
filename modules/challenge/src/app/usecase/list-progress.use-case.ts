import { ListProgressQueryService } from '@app/query-service/list-progress.query-service'
import { ChallengeId } from '@domain/challenge'
import { ProgressStatus } from '@domain/progress'

interface ListProgressUseCaseParams {
  challengeIds: string[]
  status: string
  page: number
}

const statuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'] as const

export class ListProgressUseCase {
  constructor(private listProgressQueryService: ListProgressQueryService) {}

  execute(params: ListProgressUseCaseParams) {
    return this.listProgressQueryService.list({
      challengeIds: params.challengeIds.map((challengeId) => new ChallengeId(challengeId)),
      status: new ProgressStatus(params.status),
      page: params.page,
    })
  }
}

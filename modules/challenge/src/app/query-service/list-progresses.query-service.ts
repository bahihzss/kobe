import { ChallengeId } from '@domain/challenge'
import { ProgressStatus } from '@domain/progress'

export interface ListProgressesQuery {
  challengeIds: ChallengeId[]
  status: ProgressStatus
  page: number
}

export interface ListedProgressesDto {
  page: number
  progresses: {
    assignee: {
      name: string
    }
    challenge: {
      title: string
    }
  }[]
}

export interface ListProgressesQueryService {
  list(query: ListProgressesQuery): Promise<ListedProgressesDto>
}

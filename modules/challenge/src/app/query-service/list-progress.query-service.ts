import { ChallengeId } from '@domain/challenge'
import { ProgressStatus } from '@domain/progress'

export interface ListProgressQuery {
  challengeIds: ChallengeId[]
  status: ProgressStatus
  page: number
}

export interface ListedProgressDto {
  page: number
  nextPage?: number
  progresses: {
    id: string
    assignee: {
      name: string
    }
    challenge: {
      id: string
      title: string
    }
  }[]
}

export interface ListProgressQueryService {
  list(query: ListProgressQuery): Promise<ListedProgressDto>
}

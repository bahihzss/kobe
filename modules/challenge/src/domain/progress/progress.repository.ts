import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { Progress } from '@domain/progress/progress'
import { ProgressId } from '@domain/progress/progress-id'

export interface ProgressRepository {
  save(progress: Progress): Promise<void>

  findById(id: ProgressId): Promise<Progress | undefined>

  findByChallengeAndAssignee(params: {
    challengeId: ChallengeId
    assigneeId: ParticipantId
  }): Promise<Progress | undefined>
}

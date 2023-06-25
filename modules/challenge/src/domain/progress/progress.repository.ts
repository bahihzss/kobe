import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { Progress } from '@domain/progress/progress'

export interface ProgressRepository {
  findByChallengeAndAssignee: (params: { challengeId: ChallengeId; assigneeId: ParticipantId }) => Promise<Progress>
  save: (progress: Progress) => Promise<void>
}

import { Progress } from '@domain/progress/progress'
import { ProgressId } from '@domain/progress/progress-id'

export interface ProgressRepository {
  update(progress: Progress): Promise<void>

  insertMany(progresses: Progress[]): Promise<void>

  findById(id: ProgressId): Promise<Progress | undefined>
}

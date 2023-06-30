import { Challenge } from '@domain/challenge/challenge'

export interface ChallengeRepository {
  listAll(): Promise<Challenge[]>
}

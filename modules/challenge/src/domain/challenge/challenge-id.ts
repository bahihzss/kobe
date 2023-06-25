import { BaseUlid } from '@kobe/common/domain'

export class ChallengeId extends BaseUlid {
  type = 'ChallengeId' as const
}

import { BaseUlid } from '@kobe/common/domain'

export class TeamId extends BaseUlid {
  type = 'TeamId' as const
}

import { BaseUlid } from '@kobe/common/domain'

export class PairId extends BaseUlid {
  type = 'PairId' as const
}

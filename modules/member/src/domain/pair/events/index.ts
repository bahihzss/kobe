import { PairCreated } from '@domain/pair/events/pair-created'
import { BaseUlid } from '@kobe/common/domain'

export type PairEvent = PairCreated

export class PairEventId extends BaseUlid {
  type = 'PairEventId' as const
}

export * from './pair-created'

import { BaseUlid } from '@kobe/common/domain'

export class ProgressId extends BaseUlid {
  type = 'ProgressId' as const
}

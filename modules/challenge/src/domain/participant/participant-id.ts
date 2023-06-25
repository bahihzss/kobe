import { BaseUlid } from '@kobe/common/domain'

export class ParticipantId extends BaseUlid {
  type = 'ParticipantId' as const
}

import { BaseUlid } from '@kobe/common/domain'
import { ParticipantEnrolled } from './participant-enrolled'

export * from './participant-enrolled'

export class ParticipantEventId extends BaseUlid {
  type = 'ParticipantEventId' as const
}

export type ParticipantEvent = ParticipantEnrolled

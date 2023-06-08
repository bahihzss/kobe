import { Stack } from '@kobe/common/infra/type'
import { Timestamp } from '@kobe/firebase/type'

export interface ParticipantDocument {
  id: string
  name: string
}

export type ParticipantEventDocument<S extends Stack = 'write'> = ParticipantEnrolledDocument<S>

export interface ParticipantEnrolledDocument<S extends Stack = 'read'> {
  type: 'ParticipantEnrolled'
  payload: {
    id: string
    participantId: string
    name: string
    enrolledAt: Timestamp<S>
  }
}

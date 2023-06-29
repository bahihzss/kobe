import { Stack } from '@kobe/common/infra/type'
import { Timestamp } from '@kobe/firebase/type'

type ParticipantStatus = '在籍中' | '休会中' | '退会済'

export interface ParticipantDocument {
  id: string
  name: string
  email: string
  status: ParticipantStatus
}

export type ParticipantEventDocument<S extends Stack = 'write'> = ParticipantEnrolledDocument<S>

export interface ParticipantEnrolledDocument<S extends Stack = 'read'> {
  type: 'ParticipantEnrolled'
  payload: {
    id: string
    participantId: string
    name: string
    email: string
    enrolledAt: Timestamp<S>
  }
}

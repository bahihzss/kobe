import { Stack } from '@kobe/common/infra/type'
import { Timestamp } from '@kobe/firebase/type'

export interface TeamDocument {
  id: string
  name: string
  members: string[]
}

export interface TeamCreatedDocument<S extends Stack = 'read'> {
  type: 'TeamCreated'
  payload: {
    id: string
    teamId: string
    name: string
    members: string[]
    createdAt: Timestamp<S>
  }
}

export interface TeamMemberAddedDocument<S extends Stack = 'read'> {
  type: 'TeamMemberAdded'
  payload: {
    id: string
    teamId: string
    newMemberId: string
    addedAt: Timestamp<S>
  }
}

export type TeamEventDocument<S extends Stack = 'write'> = TeamCreatedDocument<S> | TeamMemberAddedDocument<S>

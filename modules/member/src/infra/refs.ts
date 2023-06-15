import { collection } from '@infra/collection'
import { ParticipantDocument, ParticipantEventDocument } from '@infra/interface/participant.document'
import { TeamDocument, TeamEventDocument } from '@infra/interface/team.document'
import { firestore } from 'firebase-admin'
import { Firestore } from 'firebase-admin/firestore'
import CollectionReference = firestore.CollectionReference

export const references = (firestore: Firestore) => {
  const participants = () => firestore.collection(collection.participants) as CollectionReference<ParticipantDocument>
  const participant = (participantId: string) => participants().doc(participantId)
  const participantEvents = (participantId: string) =>
    participant(participantId).collection(collection.participantEvents) as CollectionReference<ParticipantEventDocument>
  const participantEvent = (participantId: string, eventId: string) => participantEvents(participantId).doc(eventId)

  const teams = () => firestore.collection(collection.teams) as CollectionReference<TeamDocument>
  const team = (teamId: string) => teams().doc(teamId)
  const teamEvents = (teamId: string) =>
    team(teamId).collection(collection.teamEvents) as CollectionReference<TeamEventDocument>
  const teamEvent = (teamId: string, eventId: string) => teamEvents(teamId).doc(eventId)

  return {
    participants,
    participant,
    participantEvents,
    participantEvent,
    teams,
    team,
    teamEvents,
    teamEvent,
  }
}

export type Refs = ReturnType<typeof references>

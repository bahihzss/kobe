import { ParticipantId } from '@domain/participant/models'
import { TeamEvent } from '@domain/team/events'
import { TeamRepository } from '@domain/team/interfaces'
import { Team, TeamId, TeamName } from '@domain/team/models'
import { TeamMembers } from '@domain/team/models/team-members'
import { collection } from '@infra/collection'
import { TeamDocument, TeamEventDocument } from '@infra/interface/team.document'
import { references, Refs } from '@infra/refs'
import { Injectable } from '@nestjs/common'
import { Firestore } from 'firebase-admin/firestore'

@Injectable()
export class TeamFirestoreRepository implements TeamRepository {
  private refs: Refs

  constructor(private firestore: Firestore) {
    this.refs = references(firestore)
  }

  async store(team: Team, event: TeamEvent): Promise<void> {
    const batch = this.firestore.batch()

    const teamRef = this.refs.team(event.teamId.value)
    batch.set(teamRef, team.serialize())
    const eventRef = this.refs.teamEvent(event.teamId.value, event.id.value)
    batch.set(eventRef, event.serialize())

    await batch.commit()
  }

  async findById(teamId: TeamId): Promise<Team | undefined> {
    const ref = this.refs.team(teamId.value)
    const snapshot = await ref.get()
    const data = snapshot.data()

    if (!data) {
      return undefined
    }

    return Team.reconstruct({
      id: new TeamId(data.id),
      members: new TeamMembers(data.members.map((memberId) => new ParticipantId(memberId))),
      name: new TeamName(data.name),
    })
  }

  async findLatest(): Promise<Team | undefined> {
    const ref = this.refs.teams().orderBy('id', 'desc').limit(1)
    const snapshot = await ref.get()
    const data = snapshot.docs[0]?.data()

    if (!data) {
      return undefined
    }

    return Team.reconstruct({
      id: new TeamId(data.id),
      members: new TeamMembers(data.members.map((memberId) => new ParticipantId(memberId))),
      name: new TeamName(data.name),
    })
  }

  async findAll(): Promise<Team[]> {
    const ref = this.refs.teams()
    const snapshot = await ref.get()

    return snapshot.docs.map((doc) => {
      const data = doc.data()

      return Team.reconstruct({
        id: new TeamId(data.id),
        members: new TeamMembers(data.members.map((memberId) => new ParticipantId(memberId))),
        name: new TeamName(data.name),
      })
    })
  }
}

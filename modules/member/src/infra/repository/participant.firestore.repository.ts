import { ParticipantEvent } from '@domain/participant/events'
import { ParticipantRepository } from '@domain/participant/interfaces'
import { Participant, ParticipantEmail, ParticipantId, ParticipantName } from '@domain/participant/models'
import { ParticipantStatus } from '@domain/participant/models/participant-status'
import { collection } from '@infra/collection'
import { ParticipantDocument, ParticipantEventDocument } from '@infra/interface/participant.document'
import { references, Refs } from '@infra/refs'
import { Injectable } from '@nestjs/common'
import { Firestore } from 'firebase-admin/firestore'

@Injectable()
export class ParticipantFirestoreRepository implements ParticipantRepository {
  private readonly refs: Refs

  constructor(private readonly firestore: Firestore) {
    this.refs = references(firestore)
  }

  async store(participant: Participant, event: ParticipantEvent): Promise<void> {
    const batch = this.firestore.batch()

    const participantRef = this.refs.participant(event.participantId.value)
    batch.set(participantRef, participant.serialize())

    const eventRef = this.refs.participantEvent(event.participantId.value, event.id.value)
    batch.set(eventRef, event.serialize())

    await batch.commit()
  }

  async findById(participantId: ParticipantId): Promise<Participant | undefined> {
    const ref = this.refs.participant(participantId.value)
    const snapshot = await ref.get()
    const data = snapshot.data()

    if (!data) {
      return undefined
    }

    return Participant.reconstruct({
      id: new ParticipantId(data.id),
      name: new ParticipantName(data.name),
      email: new ParticipantEmail(data.email),
      status: new ParticipantStatus(data.status),
    })
  }
}

import { ParticipantEvent } from '@domain/participant/events'
import { ParticipantRepository } from '@domain/participant/interfaces'
import { Participant, ParticipantId, ParticipantName } from '@domain/participant/models'
import { collection } from '@infra/collection'
import { ParticipantDocument, ParticipantEventDocument } from '@infra/interface/participant.document'
import { Refs } from '@kobe/firebase/utils'
import { Injectable } from '@nestjs/common'
import { Firestore } from 'firebase-admin/firestore'

@Injectable()
export class ParticipantFirestoreRepository implements ParticipantRepository {
  constructor(
    private readonly firestore: Firestore,
    private readonly refs: Refs<ParticipantDocument, ParticipantEventDocument>,
  ) {
    refs.setCollectionNames(collection.participants, collection.participantEvents)
  }

  async store(participant: Participant, event: ParticipantEvent): Promise<void> {
    const batch = this.firestore.batch()

    const [participantRef, eventRef] = this.refs.all(event.participantId.value, event.id.value)
    batch.set(participantRef, participant.serialize())
    batch.set(eventRef, event.serialize())

    await batch.commit()
  }

  async findById(participantId: ParticipantId): Promise<Participant | undefined> {
    const ref = this.refs.forEntity(participantId.value)
    const snapshot = await ref.get()
    const data = snapshot.data()

    if (!data) {
      return undefined
    }

    return Participant.reconstruct({
      id: new ParticipantId(data.id),
      name: new ParticipantName(data.name),
    })
  }
}

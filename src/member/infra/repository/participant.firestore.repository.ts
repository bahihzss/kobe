import { ParticipantRepository } from '@/member/domain/participant/participant.repository'
import { Participant } from '@/member/domain/participant/participant.entity'
import { ParticipantEvent } from '@/member/domain/participant/participant.event'
import { Firestore } from 'firebase-admin/firestore'
import { Injectable } from '@nestjs/common'
import { collection } from '@common/constant/collection'
import { firestore } from 'firebase-admin'
import DocumentReference = firestore.DocumentReference

@Injectable()
export class ParticipantFirestoreRepository implements ParticipantRepository {
  constructor(private firestore: Firestore) {}

  async store(
    participant: Participant,
    event: ParticipantEvent,
  ): Promise<void> {
    const batch = this.firestore.batch()

    const { participantId } = event
    const participantDocRef = this.participantDocRef(participantId.value)
    batch.set(participantDocRef, participant.snapshot)

    const eventRef = participantDocRef.collection('events').doc(event.id.value)
    batch.set(eventRef, {
      type: Object.getPrototypeOf(event).constructor.name,
      payload: { ...event },
    })
  }

  get participantColRef() {
    return this.firestore.collection(collection.participants)
  }

  participantDocRef(participantId: string) {
    return this.participantColRef.doc(participantId)
  }

  eventColRef(participantDocRef: DocumentReference) {
    return participantDocRef.collection(collection.participantEvents)
  }
}

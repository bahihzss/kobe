import { Injectable } from '@nestjs/common'
import { DocumentReference, Firestore } from 'firebase-admin/firestore'

@Injectable()
export class Refs<ET, EV> {
  private entityCollection: string = ''
  private eventCollection: string = ''

  constructor(private readonly firestore: Firestore) {}

  setCollectionNames(entityCollection: string, eventCollection: string) {
    this.entityCollection = entityCollection
    this.eventCollection = eventCollection
  }

  forEntity(entityId: string) {
    return this.firestore.collection(this.entityCollection).doc(entityId) as DocumentReference<ET>
  }

  forEvent(entityId: string, eventId: string) {
    const entityRef = this.forEntity(entityId)
    return entityRef.collection(this.eventCollection).doc(eventId) as DocumentReference<EV>
  }

  all(entityId: string, eventId: string) {
    const entityRef = this.forEntity(entityId)
    const eventRef = this.forEvent(entityId, eventId)

    return [entityRef, eventRef] as const
  }
}

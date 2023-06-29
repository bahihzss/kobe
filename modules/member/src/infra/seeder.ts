import { references } from '@infra/refs'
import { Injectable } from '@nestjs/common'
import { Firestore, FieldValue } from 'firebase-admin/firestore'
import { ulid } from 'ulid'

const firstNames = ['Yamada', 'Tanaka', 'Suzuki', 'Kimura', 'Honjo']
const lastNames = ['Taro', 'Hanako', 'Keita', 'Misaki', 'Kenta', 'Makoto']

@Injectable()
export class MemberSeeder {
  constructor(private firestore: Firestore) {}

  seed() {
    const refs = references(this.firestore)

    const batch = this.firestore.batch()

    for (const firstName of firstNames) {
      for (const lastName of lastNames) {
        const id = ulid()
        const eventId = ulid()
        const name = `${firstName} ${lastName}`
        const email = `${lastName.toLowerCase()}.${firstName.toLowerCase()}@example.com`

        batch.set(refs.participant(id), { id, name, email, status: '在籍中' })
        batch.set(refs.participantEvent(id, eventId), {
          type: 'ParticipantEnrolled',
          payload: { id: eventId, participantId: id, name, email, enrolledAt: FieldValue.serverTimestamp() },
        })
      }
    }

    return batch.commit()
  }
}

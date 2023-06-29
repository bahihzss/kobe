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
    const teamMembersList: string[][] = [[], [], []]

    let i = 0
    for (const firstName of firstNames) {
      for (const lastName of lastNames) {
        const participantId = ulid()
        const eventId = ulid()
        const name = `${firstName} ${lastName}`
        const email = `${lastName.toLowerCase()}.${firstName.toLowerCase()}@example.com`

        batch.set(refs.participant(participantId), { id: participantId, name, email, status: '在籍中' })
        batch.set(refs.participantEvent(participantId, eventId), {
          type: 'ParticipantEnrolled',
          payload: { id: eventId, participantId, name, email, enrolledAt: FieldValue.serverTimestamp() },
        })

        teamMembersList[i % 3].push(participantId)
        i++
      }
    }

    for (const i in teamMembersList) {
      const teamId = ulid()
      const members = teamMembersList[i]

      batch.set(refs.team(teamId), { id: teamId, name: `${Number(i) + 1}`, members })
    }

    return batch.commit()
  }
}

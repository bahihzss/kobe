import { ParticipantEnrolled } from '@domain/participant/events'
import { references } from '@infra/refs'
import { Injectable } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { Firestore, FieldValue } from 'firebase-admin/firestore'

const ulidBase = {
  participant: '01F2XQZ3PPPPPPPPPPPPPPPP',
  participantEvent: '01F2XQZ3PEPEPEPEPEPEPEPE',
  team: '01F2XQZ3TTTTTTTTTTTTTTTT',
  teamEvent: '01F2XQZ3TETETETETETETETE',
}

const lastNames = ['Yamada', 'Tanaka', 'Suzuki', 'Kimura', 'Honjo']
const firstNames = ['Taro', 'Hanako', 'Keita', 'Misaki', 'Kenta', 'Makoto']

@Injectable()
export class PrismaSeeder {
  constructor(private firestore: Firestore, private eventBus: EventBus) {}

  async seed() {
    const refs = references(this.firestore)

    const batch = this.firestore.batch()
    const teamMembersList: string[][] = [[], [], [], [], [], []]

    let i = 0
    for (const lastName of lastNames) {
      for (const firstName of firstNames) {
        const participantId = `${ulidBase.participant}${i.toString().padStart(2, '0')}`
        const eventId = `${ulidBase.participantEvent}${i.toString().padStart(2, '0')}`
        const name = `${lastName} ${firstName}`
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`

        batch.set(refs.participant(participantId), { id: participantId, name, email, status: '在籍中' })
        batch.set(refs.participantEvent(participantId, eventId), {
          type: 'ParticipantEnrolled',
          payload: { id: eventId, participantId, name, email, enrolledAt: FieldValue.serverTimestamp() },
        })

        teamMembersList[i % 6].push(participantId)
        i++
      }
    }

    for (const i in teamMembersList) {
      const teamId = `${ulidBase.team}${i.toString().padStart(2, '0')}`
      const eventId = `${ulidBase.teamEvent}${i.toString().padStart(2, '0')}`
      const members = teamMembersList[i]

      batch.set(refs.team(teamId), { id: teamId, name: `${Number(i) + 1}`, members })
      batch.set(refs.teamEvent(teamId, eventId), {
        type: 'TeamCreated',
        payload: { id: eventId, teamId, name: `${Number(i) + 1}`, members, createdAt: FieldValue.serverTimestamp() },
      })
    }

    await batch.commit()
  }
}

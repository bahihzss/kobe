/* istanbul ignore file */
import { ParticipantEvent } from '@domain/participant/events'
import { ParticipantRepository } from '@domain/participant/interfaces'
import { Participant, ParticipantEmail, ParticipantId } from '@domain/participant/models'

type ParticipantMeta = {
  participant: Participant
  events: ParticipantEvent[]
}

type ParticipantMap = Record<string, ParticipantMeta>

export class ParticipantInMemoryRepository implements ParticipantRepository {
  constructor(public participantMap: ParticipantMap = {}) {}

  get participants() {
    return Object.values(this.participantMap).map(({ participant }) => participant)
  }

  set participants(participants: Participant[]) {
    this.participantMap = participants.reduce((sub, participant) => {
      sub[participant.serialize().id] = { participant, events: [] }
      return sub
    }, {} as ParticipantMap)
  }

  get events() {
    return Object.values(this.participantMap)
      .map(({ events }) => events)
      .flat()
  }

  waitNext<T extends ParticipantEvent>(type: string): Promise<T> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const event = this.events.find((event) => event.serialize().type === type)

        if (event) {
          clearInterval(interval)
          resolve(event as T)
        }
      }, 10)
    })
  }

  async store(participant: Participant, participantEvent: ParticipantEvent) {
    const currentParticipantMeta = this.participantMap[participantEvent.participantId.value] ?? { events: [] }

    this.participantMap[participantEvent.participantId.value] = {
      ...currentParticipantMeta,
      participant: participant,
      events: [...currentParticipantMeta.events, participantEvent],
    }
  }

  async findById(participantId: ParticipantId) {
    return this.participantMap[participantId.value]?.participant
  }

  async findByEmail(email: ParticipantEmail) {
    return Object.values(this.participantMap).find(({ participant }) => participant.serialize().email === email.value)
      ?.participant
  }
}

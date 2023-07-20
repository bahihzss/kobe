import { Participant, ParticipantEmail, ParticipantId, ParticipantName } from '@domain/participant/models'
import { ParticipantFirestoreRepository } from '@infra/repository'
import { FirebaseModule } from '@kobe/firebase'
import { clearFirestore } from '@kobe/firebase/testing'
import { Test } from '@nestjs/testing'

describe('ParticipantFirestoreRepository', () => {
  let participantRepository: ParticipantFirestoreRepository

  beforeEach(async () => {
    const testApp = await Test.createTestingModule({
      imports: [FirebaseModule],
      providers: [ParticipantFirestoreRepository],
    }).compile()

    participantRepository = testApp.get(ParticipantFirestoreRepository)

    await clearFirestore()
  })

  test('ParticipantEnrolled を store すると findById で取得できる', async () => {
    const [participant, participantEnrolledEvent] = Participant.enroll({
      name: new ParticipantName('Shota Furuno'),
      email: new ParticipantEmail('furuno@example.com'),
    })

    await participantRepository.store(participant, participantEnrolledEvent)

    const { participantId } = participantEnrolledEvent
    const foundParticipant = await participantRepository.findById(participantId)

    expect(foundParticipant).toEqual(participant)
  })

  test('存在しない参加者を findById すると undefined が返る', async () => {
    const participantId = new ParticipantId()
    const foundParticipant = await participantRepository.findById(participantId)

    expect(foundParticipant).toBeUndefined()
  })

  test('ParticipantEnrolled を store すると findByEmail で取得できる', async () => {
    const [participant, participantEnrolledEvent] = Participant.enroll({
      name: new ParticipantName('Shota Furuno'),
      email: new ParticipantEmail('furuno@example.com'),
    })

    await participantRepository.store(participant, participantEnrolledEvent)

    const { email } = participantEnrolledEvent
    const foundParticipant = await participantRepository.findByEmail(email)

    expect(foundParticipant).toEqual(participant)
  })

  test('存在しないメールアドレスで findByEmail すると undefined が返る', async () => {
    const email = new ParticipantEmail('none@example.con')
    const foundParticipant = await participantRepository.findByEmail(email)

    expect(foundParticipant).toBeUndefined()
  })
})

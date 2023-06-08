import { Participant, ParticipantId, ParticipantName } from '@domain/participant/models'
import { ParticipantFirestoreRepository } from '@infra/repository'
import { FirebaseModule } from '@kobe/firebase'
import { clearFirestore } from '@kobe/firebase/testing'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'

describe('ParticipantFirestoreRepository', () => {
  let participantRepository: ParticipantFirestoreRepository

  beforeEach(async () => {
    const testApp = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), FirebaseModule],
      providers: [ParticipantFirestoreRepository],
    }).compile()

    participantRepository = testApp.get(ParticipantFirestoreRepository)

    await clearFirestore()
  })

  test('ParticipantEnrolled を store すると findBy で取得できる', async () => {
    const [participant, participantEnrolledEvent] = Participant.enroll({
      name: new ParticipantName('Shota Furuno'),
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
})

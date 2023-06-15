import { EnrollNewParticipantUseCase } from '@app/use-case'
import { EnrollNewParticipantCommandHandler } from '@domain/participant/commands'
import { collection } from '@infra/collection'
import { ParticipantFirestoreRepository } from '@infra/repository'
import { FirebaseModule } from '@kobe/firebase'
import { clearFirestore, fetchFirst } from '@kobe/firebase/testing'
import { patterns } from '@kobe/patterns'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { Test, TestingModule } from '@nestjs/testing'
import { MemberCommandModule } from '@root/member-command.module'
import { Token } from '@root/token'
import { Firestore, Timestamp } from 'firebase-admin/firestore'

describe('EnrollNewParticipantUseCase', () => {
  let testApp: TestingModule
  let useCase: EnrollNewParticipantUseCase
  let firestore: Firestore

  beforeEach(async () => {
    testApp = await Test.createTestingModule({
      imports: [CqrsModule, FirebaseModule],
      providers: [
        EnrollNewParticipantUseCase,
        EnrollNewParticipantCommandHandler,
        {
          provide: Token.ParticipantRepository,
          useClass: ParticipantFirestoreRepository,
        },
      ],
    }).compile()
    testApp.get(CqrsModule).onApplicationBootstrap()

    useCase = testApp.get(EnrollNewParticipantUseCase)
    firestore = testApp.get(Firestore)

    await clearFirestore()
  })

  test('execute に名前を渡すと /participants に参加者が追加される', async () => {
    await useCase.execute({ name: 'Yuto Kawamoto' })

    const participantDoc = await fetchFirst(firestore, collection.participants)
    expect(participantDoc).toEqual({
      id: expect.stringMatching(patterns.ulid),
      name: 'Yuto Kawamoto',
    })
  })

  test('execute に名前を渡すと /participants/{id}/events にイベントが記録される', async () => {
    await useCase.execute({ name: 'Yuto Kawamoto' })

    const eventDoc = await fetchFirst(firestore, collection.participantEvents)
    expect(eventDoc).toEqual({
      type: 'ParticipantEnrolled',
      payload: {
        id: expect.stringMatching(patterns.ulid),
        participantId: expect.stringMatching(patterns.ulid),
        name: 'Yuto Kawamoto',
        enrolledAt: expect.any(Timestamp),
      },
    })
  })
})

import { EnrollNewParticipantCommand, EnrollNewParticipantCommandHandler } from '@domain/participant/commands'
import { ParticipantEnrolled } from '@domain/participant/events'
import { Participant, ParticipantName } from '@domain/participant/models'
import { ParticipantMockRepository } from '@infra/repository'
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs'
import { Test, TestingModule } from '@nestjs/testing'
import { Token } from '@root/token'

describe('EnrollNewParticipantCommand', () => {
  let testApp: TestingModule
  let commandBus: CommandBus

  beforeEach(async () => {
    testApp = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        {
          provide: Token.ParticipantRepository,
          useClass: ParticipantMockRepository,
        },
        EnrollNewParticipantCommandHandler,
      ],
    }).compile()
    testApp.get(CqrsModule).onApplicationBootstrap()

    commandBus = testApp.get(CommandBus)
  })

  test('参加者が登録される', async () => {
    const participantRepository = testApp.get<ParticipantMockRepository>(Token.ParticipantRepository)

    const command = new EnrollNewParticipantCommand(new ParticipantName('Norio Yamashita'))
    await commandBus.execute(command)

    expect(participantRepository.store).toBeCalledWith(expect.any(Participant), expect.any(ParticipantEnrolled))
  })

  test('ParticipantEnrolled イベントが発行される', async () => {
    const eventBus = testApp.get(EventBus)
    jest.spyOn(eventBus, 'publish')

    const command = new EnrollNewParticipantCommand(new ParticipantName('Norio Yamashita'))
    await commandBus.execute(command)

    expect(eventBus.publish).toBeCalledWith(expect.any(ParticipantEnrolled))
  })
})

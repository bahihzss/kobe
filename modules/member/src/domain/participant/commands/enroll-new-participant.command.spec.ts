import { EnrollNewParticipantCommand, EnrollNewParticipantCommandHandler } from '@domain/participant/commands'
import { ParticipantEnrolled } from '@domain/participant/events'
import { Participant, ParticipantEmail, ParticipantName } from '@domain/participant/models'
import { EmailDuplicatedException } from '@domain/participant/services/email-duplicated.exception'
import { EmailDuplicationChecker } from '@domain/participant/services/email-duplication-checker'
import { Faker } from '@domain/utils'
import { ParticipantMockRepository } from '@infra/repository'
import { DomainException } from '@kobe/common/domain'
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs'
import { Test, TestingModule } from '@nestjs/testing'
import { Token } from '@root/token'

describe('EnrollNewParticipantCommand', () => {
  let testApp: TestingModule
  let commandBus: CommandBus
  let participantRepository: ParticipantMockRepository

  beforeEach(async () => {
    testApp = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        {
          provide: Token.ParticipantRepository,
          useClass: ParticipantMockRepository,
        },
        EnrollNewParticipantCommandHandler,
        EmailDuplicationChecker,
      ],
    }).compile()
    testApp.get(CqrsModule).onApplicationBootstrap()

    commandBus = testApp.get(CommandBus)
    participantRepository = testApp.get<ParticipantMockRepository>(Token.ParticipantRepository)
  })

  test('参加者が登録される', async () => {
    const participantRepository = testApp.get<ParticipantMockRepository>(Token.ParticipantRepository)

    const command = new EnrollNewParticipantCommand(
      new ParticipantName('Norio Yamashita'),
      new ParticipantEmail('yamashita@example.com'),
    )
    await commandBus.execute(command)

    expect(participantRepository.store).toBeCalledWith(expect.any(Participant), expect.any(ParticipantEnrolled))
  })

  test('ParticipantEnrolled イベントが発行される', async () => {
    const eventBus = testApp.get(EventBus)
    jest.spyOn(eventBus, 'publish')

    const command = new EnrollNewParticipantCommand(
      new ParticipantName('Norio Yamashita'),
      new ParticipantEmail('yamashita@example.com'),
    )
    await commandBus.execute(command)

    expect(eventBus.publish).toBeCalledWith(expect.any(ParticipantEnrolled))
  })

  test('すでに登録済みのメールアドレスの場合はエラーになる', async () => {
    const existingParticipant = Faker.participant({ email: 'yamashita@example.com' })
    participantRepository.findByEmail.mockResolvedValue(existingParticipant)

    const command = new EnrollNewParticipantCommand(
      new ParticipantName('Norio Yamashita'),
      new ParticipantEmail('yamashita@example.com'),
    )

    const act = () => commandBus.execute(command)

    await expect(act).rejects.toThrow(EmailDuplicatedException)
  })
})

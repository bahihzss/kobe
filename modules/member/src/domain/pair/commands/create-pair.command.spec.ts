import { CreatePairCommand, CreatePairCommandHandler } from '@domain/pair/commands/create-pair.command'
import { PairCreated } from '@domain/pair/events'
import { Pair } from '@domain/pair/models'
import { TeamId } from '@domain/team/models'
import { Faker } from '@domain/utils'
import { PairInMemoryRepository } from '@infra/repository'
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs'
import { Test, TestingModule } from '@nestjs/testing'
import { Token } from '@root/token'

jest.mock('@infra/repository')

describe('CreatePairCommand', () => {
  let testApp: TestingModule
  let commandBus: CommandBus

  beforeEach(async () => {
    testApp = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        {
          provide: Token.PairRepository,
          useClass: PairInMemoryRepository,
        },
        CreatePairCommandHandler,
      ],
    }).compile()
    testApp.get(CqrsModule).onApplicationBootstrap()

    commandBus = testApp.get(CommandBus)
  })

  test('ペアが作成される', async () => {
    const pairRepository = testApp.get<PairInMemoryRepository>(Token.PairRepository)

    await commandBus.execute(new CreatePairCommand(new TeamId(), Faker.pairMembers()))

    expect(pairRepository.store).toBeCalledWith(expect.any(Pair), expect.any(PairCreated))
  })

  test('PairCreated イベントが発行される', async () => {
    const eventBus = testApp.get(EventBus)
    jest.spyOn(eventBus, 'publish')

    await commandBus.execute(new CreatePairCommand(new TeamId(), Faker.pairMembers()))

    expect(eventBus.publish).toBeCalledWith(expect.any(PairCreated))
  })
})

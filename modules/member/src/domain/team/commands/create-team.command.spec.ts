import { CreateTeamCommand, CreateTeamCommandHandler } from '@domain/team/commands'
import { TeamCreated } from '@domain/team/events'
import { Team } from '@domain/team/models'
import { Faker } from '@domain/utils'
import { TeamInMemoryRepository } from '@infra/repository'
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs'
import { Test, TestingModule } from '@nestjs/testing'
import { Token } from '@root/token'

describe('CreateTeamCommand', () => {
  let testApp: TestingModule
  let commandBus: CommandBus

  beforeEach(async () => {
    testApp = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        {
          provide: Token.TeamRepository,
          useClass: TeamInMemoryRepository,
        },
        CreateTeamCommandHandler,
      ],
    }).compile()
    testApp.get(CqrsModule).onApplicationBootstrap()

    commandBus = testApp.get(CommandBus)
  })

  test('チームが作成される', async () => {
    const teamRepository = testApp.get<TeamInMemoryRepository>(Token.TeamRepository)
    jest.spyOn(teamRepository, 'store')
    const members = Faker.teamMembers()

    await commandBus.execute(new CreateTeamCommand(members))

    expect(teamRepository.store).toBeCalledWith(expect.any(Team), expect.any(TeamCreated))
  })

  test('TeamCreated イベントが発行される', async () => {
    const eventBus = testApp.get(EventBus)
    jest.spyOn(eventBus, 'publish')
    const members = Faker.teamMembers()

    await commandBus.execute(new CreateTeamCommand(members))

    expect(eventBus.publish).toBeCalledWith(expect.any(TeamCreated))
  })
})

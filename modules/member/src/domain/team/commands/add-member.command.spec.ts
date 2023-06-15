import { ParticipantId } from '@domain/participant/models'
import { AddMemberCommand, AddMemberCommandHandler } from '@domain/team/commands'
import { TeamMemberAdded } from '@domain/team/events'
import { Team } from '@domain/team/models'
import { OpenTeamFinder } from '@domain/team/services'
import { Faker } from '@domain/utils'
import { TeamInMemoryRepository } from '@infra/repository'
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs'
import { Test, TestingModule } from '@nestjs/testing'
import { Token } from '@root/token'

describe('AddMemberCommand', () => {
  let testApp: TestingModule
  let commandBus: CommandBus
  let teamRepository: TeamInMemoryRepository

  beforeEach(async () => {
    testApp = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        {
          provide: Token.TeamRepository,
          useClass: TeamInMemoryRepository,
        },
        AddMemberCommandHandler,
        OpenTeamFinder,
      ],
    }).compile()
    testApp.get(CqrsModule).onApplicationBootstrap()

    commandBus = testApp.get(CommandBus)

    teamRepository = testApp.get<TeamInMemoryRepository>(Token.TeamRepository)
    teamRepository.teams = [Faker.team(3)]
  })

  test('チームにメンバーが追加される', async () => {
    jest.spyOn(teamRepository, 'store')
    const newMemberId = new ParticipantId()

    await commandBus.execute(new AddMemberCommand(newMemberId))

    expect(teamRepository.store).toBeCalledWith(expect.any(Team), expect.any(TeamMemberAdded))
  })

  test('TeamMemberAdded イベントが発行される', async () => {
    const eventBus = testApp.get(EventBus)
    jest.spyOn(eventBus, 'publish')
    const newMemberId = new ParticipantId()

    await commandBus.execute(new AddMemberCommand(newMemberId))

    expect(eventBus.publish).toBeCalledWith(expect.any(TeamMemberAdded))
  })
})

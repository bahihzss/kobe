import { EnrollNewParticipantUseCase } from '@app/use-case'
import { EnrollNewParticipantCommand, EnrollNewParticipantCommandHandler } from '@domain/participant/commands'
import { ParticipantEnrolled } from '@domain/participant/events'
import { ParticipantEmail, ParticipantName } from '@domain/participant/models'
import { EnrollmentSagas } from '@domain/sagas'
import { AddMemberCommandHandler } from '@domain/team/commands'
import { TeamMemberAdded } from '@domain/team/events'
import { Team } from '@domain/team/models'
import { OpenTeamFinder } from '@domain/team/services'
import { Faker } from '@domain/utils'
import { TeamInMemoryRepository } from '@infra/repository'
import { ParticipantInMemoryRepository } from '@infra/repository/participant.in-memory.repository'
import { TeamFirestoreRepository } from '@infra/repository/team.firestore.repository'
import { FirebaseModule } from '@kobe/firebase'
import { CommandBus, CqrsModule } from '@nestjs/cqrs'
import { Test } from '@nestjs/testing'
import { Token } from '@root/token'

describe('EnrollmentSagas', () => {
  const [team, teamCreated] = Team.create({ members: Faker.teamMembers() })
  let commandBus: CommandBus
  let participantRepository: ParticipantInMemoryRepository
  let teamRepository: TeamInMemoryRepository

  beforeEach(async () => {
    const testApp = await Test.createTestingModule({
      imports: [CqrsModule, FirebaseModule],
      providers: [
        EnrollmentSagas,
        EnrollNewParticipantCommandHandler,
        AddMemberCommandHandler,
        OpenTeamFinder,
        {
          provide: Token.ParticipantRepository,
          useClass: ParticipantInMemoryRepository,
        },
        {
          provide: Token.TeamRepository,
          useClass: TeamInMemoryRepository,
        },
      ],
    }).compile()
    testApp.get(CqrsModule).onApplicationBootstrap()

    commandBus = testApp.get(CommandBus)

    participantRepository = testApp.get<ParticipantInMemoryRepository>(Token.ParticipantRepository)
    teamRepository = testApp.get<TeamInMemoryRepository>(Token.TeamRepository)

    await teamRepository.store(team, teamCreated)
  })

  test('ユーザーを登録すると、自動的に空いているチームに追加される', async () => {
    const participantEnrolledPromise = participantRepository.waitNext<ParticipantEnrolled>('ParticipantEnrolled')
    const memberAddedPromise = teamRepository.waitNext<TeamMemberAdded>('TeamMemberAdded')

    const enrollNewParticipantCommand = new EnrollNewParticipantCommand(
      new ParticipantName('Yuto Kawamoto'),
      new ParticipantEmail('kawamoto@example.com'),
    )
    await commandBus.execute(enrollNewParticipantCommand)

    const participantAdded = await participantEnrolledPromise
    expect(participantAdded.name).toEqual(enrollNewParticipantCommand.name)

    const teamMemberAdded = await memberAddedPromise
    expect(teamMemberAdded.teamId).toEqual(team.id)
    expect(teamMemberAdded.newMemberId).toEqual(participantAdded.participantId)
  })
})

import { Team, TeamId } from '@domain/team/models'
import { Faker } from '@domain/utils'
import { TeamFirestoreRepository } from '@infra/repository/team.firestore.repository'
import { FirebaseModule } from '@kobe/firebase'
import { clearFirestore } from '@kobe/firebase/testing'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'

describe('TeamFirestoreRepository', () => {
  let teamRepository: TeamFirestoreRepository

  beforeEach(async () => {
    const testApp = await Test.createTestingModule({
      imports: [FirebaseModule],
      providers: [TeamFirestoreRepository],
    }).compile()

    teamRepository = testApp.get(TeamFirestoreRepository)

    await clearFirestore()
  })

  const createTeam = async () => {
    const [team, teamCreatedEvent] = Team.create({
      members: Faker.teamMembers(),
    })
    await teamRepository.store(team, teamCreatedEvent)

    return [team, teamCreatedEvent]
  }

  test('TeamCreated を store すると findBy で取得できる', async () => {
    const [team, teamCreatedEvent] = Team.create({
      members: Faker.teamMembers(),
    })

    await teamRepository.store(team, teamCreatedEvent)

    const { teamId } = teamCreatedEvent
    const foundTeam = await teamRepository.findById(teamId)

    expect(foundTeam).toEqual(team)
  })

  test('存在しないチームを findById すると undefined が返る', async () => {
    const teamId = new TeamId()
    const foundTeam = await teamRepository.findById(teamId)

    expect(foundTeam).toBeUndefined()
  })

  test('findLatest で最後に作成されたチームを取得できる', async () => {
    await createTeam()
    const [latestTeam] = await createTeam()

    const foundTeam = await teamRepository.findLatest()

    expect(foundTeam).toEqual(latestTeam)
  })

  test('findAll で全てのチームを取得できる', async () => {
    const [team1] = await createTeam()
    const [team2] = await createTeam()

    const foundTeams = await teamRepository.findAll()

    expect(foundTeams).toHaveLength(2)
    expect(foundTeams).toEqual([team1, team2])
  })
})

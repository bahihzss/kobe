import { Team } from '@domain/team/models'
import { OpenTeamFinder } from '@domain/team/services'
import { Faker } from '@domain/utils'
import { TeamInMemoryRepository } from '@infra/repository'

describe('OpenTeamFinder', () => {
  test('人数が少ないチームからランダムで１チーム取得する', async () => {
    const teams = [Faker.team(3), Faker.team(3), Faker.team(4), Faker.team(5)]
    const teamRepository = new TeamInMemoryRepository(teams)
    const openTeamFinder = new OpenTeamFinder(teamRepository)

    const actualTeam = await openTeamFinder.find()

    expect(actualTeam).toBeInstanceOf(Team)
    expect([teams[0], teams[1]]).toContain(actualTeam)
  })
})

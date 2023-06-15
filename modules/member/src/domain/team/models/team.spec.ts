import { Team, TeamId, TeamName } from '@domain/team/models'
import { Faker } from '@domain/utils'
import { patterns } from '@kobe/patterns'

describe('Team', () => {
  test('create で Team 1 を作成できる', () => {
    const members = Faker.teamMembers()
    const [team, teamCreatedEvent] = Team.create({ members })

    expect(team.serialize()).toEqual({
      id: expect.stringMatching(patterns.ulid),
      name: '1',
      members: members.serialize(),
    })

    expect(teamCreatedEvent.serialize()).toEqual({
      type: 'TeamCreated',
      payload: {
        id: expect.stringMatching(patterns.ulid),
        teamId: expect.stringMatching(patterns.ulid),
        name: '1',
        members: members.serialize(),
        createdAt: expect.any(Date),
      },
    })
  })

  test('create に最後に作成したチームを渡すと、次のチームを作成する', () => {
    const latestTeam = Faker.team()
    const members = Faker.teamMembers()
    const [team, teamCreatedEvent] = Team.create({ members, latestTeam })

    expect(team.serialize().name).toEqual('2')
    expect(teamCreatedEvent.serialize().payload.name).toEqual('2')
  })

  test('reconstruct で DB のデータからインスタンスを再構築できる', () => {
    const members = Faker.teamMembers()
    const team = Team.reconstruct({
      id: new TeamId('01F0YQZJQZ2XQZJQZJQZJQZJQZ'),
      name: new TeamName('1'),
      members,
    })

    expect(team.serialize()).toEqual({
      id: '01F0YQZJQZ2XQZJQZJQZJQZJQZ',
      name: '1',
      members: members.serialize(),
    })
  })

  test('equals で等価性を判定できる', () => {
    const members = Faker.teamMembers()
    const team1 = Team.reconstruct({
      id: new TeamId(Faker.ulid('1')),
      name: new TeamName('1'),
      members,
    })
    const team2 = Team.reconstruct({
      id: new TeamId(Faker.ulid('2')),
      name: new TeamName('2'),
      members,
    })
    const otherTeam1 = Team.reconstruct({
      id: new TeamId(Faker.ulid('1')),
      name: new TeamName('1'),
      members,
    })

    expect(team1.equals(team2)).toBe(false)
    expect(team1.equals(otherTeam1)).toBe(true)
  })

  test('compareWith でメンバー数を比較できる', () => {
    const team1 = Team.reconstruct({
      id: new TeamId(Faker.ulid('1')),
      name: new TeamName('1'),
      members: Faker.teamMembers(4),
    })
    const team2 = Team.reconstruct({
      id: new TeamId(Faker.ulid('2')),
      name: new TeamName('2'),
      members: Faker.teamMembers(5),
    })

    expect(team1.compareWith(team2)).toBe(-1)
    expect(team1.compareWith(team1)).toBe(0)
    expect(team2.compareWith(team1)).toBe(1)
  })

  test('hasSameMemberCount でメンバー数が同じかどうかを判定できる', () => {
    const team1 = Team.reconstruct({
      id: new TeamId(Faker.ulid('1')),
      name: new TeamName('1'),
      members: Faker.teamMembers(4),
    })
    const team2 = Team.reconstruct({
      id: new TeamId(Faker.ulid('2')),
      name: new TeamName('2'),
      members: Faker.teamMembers(5),
    })

    expect(team1.hasSameMemberCount(team2)).toBe(false)
    expect(team1.hasSameMemberCount(team1)).toBe(true)
  })
})

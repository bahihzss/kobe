import { Pair, PairId, PairName } from '@domain/pair/models'
import { TeamId } from '@domain/team/models'
import { patterns } from '@kobe/patterns'
import { Faker } from 'src/domain/utils'

describe('Pair', () => {
  test('create にチーム ID を渡すと、そのチームのペア "a" を作成する', () => {
    const team = Faker.team()
    const members = Faker.pairMembers()
    const [pair, pairCreatedEvent] = Pair.create({ members, teamId: team.id })

    expect(pair.serialize()).toEqual({
      id: expect.stringMatching(patterns.ulid),
      name: 'a',
      teamId: team.id.value,
      members: members.serialize(),
    })

    expect(pairCreatedEvent.serialize()).toEqual({
      type: 'PairCreated',
      payload: {
        id: expect.stringMatching(patterns.ulid),
        pairId: expect.stringMatching(patterns.ulid),
        name: 'a',
        teamId: team.id.value,
        members: members.serialize(),
        createdAt: expect.any(Date),
      },
    })
  })

  test('create に最後に作成したペアを渡すと、次のペアを作成する', () => {
    const team = Faker.team()
    const members = Faker.pairMembers()
    const [latestPair] = Pair.create({ members, teamId: team.id })
    const [pair, pairCreatedEvent] = Pair.create({ members, teamId: team.id, latestPair })

    expect(pair.serialize().name).toEqual('b')
    expect(pairCreatedEvent.serialize().payload.name).toEqual('b')
  })

  test('reconstruct で DB のデータからインスタンスを再構築できる', () => {
    const members = Faker.pairMembers()
    const pair = Pair.reconstruct({
      id: new PairId('01F0YQZJQZ2XQZJQZJQZJQZJQZ'),
      name: new PairName('a'),
      teamId: new TeamId('01F0YQZJQZ2XQZJQZJQZJQZJQZ'),
      members,
    })

    expect(pair.serialize()).toEqual({
      id: '01F0YQZJQZ2XQZJQZJQZJQZJQZ',
      name: 'a',
      teamId: '01F0YQZJQZ2XQZJQZJQZJQZJQZ',
      members: members.serialize(),
    })
  })

  test('equals で等価性を判定できる', () => {
    const members = Faker.pairMembers()
    const pairA = Pair.reconstruct({
      id: new PairId(Faker.ulid('A')),
      name: new PairName('a'),
      teamId: new TeamId(Faker.ulid('Z')),
      members,
    })
    const pairB = Pair.reconstruct({
      id: new PairId(Faker.ulid('B')),
      name: new PairName('b'),
      teamId: new TeamId(Faker.ulid('Z')),
      members,
    })
    const otherPairA = Pair.reconstruct({
      id: new PairId(Faker.ulid('A')),
      name: new PairName('a'),
      teamId: new TeamId(Faker.ulid('Z')),
      members,
    })

    expect(pairA.equals(pairB)).toBe(false)
    expect(pairA.equals(otherPairA)).toBe(true)
  })
})

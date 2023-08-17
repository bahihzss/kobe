import { Pair } from '@domain/pair/models'
import { PairMembers } from '@domain/pair/models/pair-members'
import { OpenPairFinder } from '@domain/pair/service'
import { NonOpenPairException } from '@domain/pair/service/non-open-pair.exception'
import { ParticipantId } from '@domain/participant/models'
import { TeamId } from '@domain/team/models'
import { Faker } from '@domain/utils'
import { PairInMemoryRepository } from '@infra/repository'

describe('OpenPairFinder', () => {
  const createPairRepository = (teamId: TeamId, pairMembersList: PairMembers[]) => {
    const pairRepository = new PairInMemoryRepository()
    let latestPair: Pair | undefined = undefined

    for (const members of pairMembersList) {
      const [pair] = Pair.create({
        teamId,
        members,
        latestPair: latestPair ? latestPair : undefined,
      })
      latestPair = pair
      pairRepository.pairs.push(pair)
    }

    return pairRepository
  }

  test('空きのあるペアからダンダムで１ペア取得する', async () => {
    const team = Faker.team(7)
    const teamId = new TeamId(team.serialize().id)
    const teamMembers = team.serialize().members.map((memberId) => new ParticipantId(memberId))
    const pairMembersList = [
      new PairMembers([teamMembers[0], teamMembers[1]]),
      new PairMembers([teamMembers[2], teamMembers[3]]),
      new PairMembers([teamMembers[4], teamMembers[5], teamMembers[6]]),
    ]
    const pairRepository = createPairRepository(teamId, pairMembersList)
    const openPairFinder = new OpenPairFinder(pairRepository)

    const actualOpenPair = await openPairFinder.find(teamId)

    const { pairs } = pairRepository
    expect(actualOpenPair).toBeInstanceOf(Pair)
    expect([pairs[0], pairs[1]]).toContain(actualOpenPair)
  })

  test('空きのあるペアがない場合は例外を投げる', async () => {
    const team = Faker.team(9)
    const teamId = new TeamId(team.serialize().id)
    const teamMembers = team.serialize().members.map((memberId) => new ParticipantId(memberId))
    const pairMembersList = [
      new PairMembers([teamMembers[0], teamMembers[1], teamMembers[2]]),
      new PairMembers([teamMembers[3], teamMembers[4], teamMembers[5]]),
      new PairMembers([teamMembers[6], teamMembers[7], teamMembers[8]]),
    ]
    const pairRepository = createPairRepository(teamId, pairMembersList)
    const openPairFinder = new OpenPairFinder(pairRepository)

    const act = () => openPairFinder.find(teamId)

    await expect(act).rejects.toThrowError(NonOpenPairException)
  })
})

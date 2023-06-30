import { PrismaSeeder } from '@infra/prisma.seeder'
import { PrismaService } from '@infra/prisma.service'
import { ChallengePrismaRepository } from '@infra/repositories/challenge.prisma.repository'
import { Test } from '@nestjs/testing'

describe('ChallengePrismaRepository', () => {
  let challengeRepository: ChallengePrismaRepository

  beforeEach(async () => {
    const testApp = await Test.createTestingModule({
      providers: [PrismaService, PrismaSeeder, ChallengePrismaRepository],
    }).compile()

    await testApp.get(PrismaSeeder).seed()

    challengeRepository = testApp.get(ChallengePrismaRepository)
  })

  test('listAll で全ての Challenge を取得できる', async () => {
    const challenges = await challengeRepository.listAll()

    expect(challenges).toHaveLength(3)
    challenges.forEach((challenge, i) => {
      const serialized = challenge.serialize()
      const expected = PrismaSeeder.data.challenges[i]

      expect(serialized).toEqual({
        id: expected.id,
        title: expected.title,
        description: expected.description,
      })
    })
  })
})

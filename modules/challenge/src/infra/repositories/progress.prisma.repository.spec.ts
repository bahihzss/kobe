import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { Progress } from '@domain/progress'
import { PrismaSeeder } from '@infra/prisma.seeder'
import { PrismaService } from '@infra/prisma.service'
import { ProgressPrismaRepository } from '@infra/repositories'
import { Test } from '@nestjs/testing'

describe('ProgressPrismaRepository', () => {
  let progressRepository: ProgressPrismaRepository

  beforeEach(async () => {
    const testApp = await Test.createTestingModule({
      providers: [PrismaService, PrismaSeeder, ProgressPrismaRepository],
    }).compile()

    await testApp.get(PrismaSeeder).seed()

    progressRepository = testApp.get(ProgressPrismaRepository)
  })

  test('save で保存したものを findByChallengeAndAssignee で取得できる', async () => {
    const challengeId = new ChallengeId(PrismaSeeder.data.challenge.id)
    const assigneeId = new ParticipantId(PrismaSeeder.data.participant.id)
    const createdProgress = Progress.assign({
      challengeId,
      assigneeId,
    })

    await progressRepository.save(createdProgress)
    const foundProcess = await progressRepository.findByChallengeAndAssignee({
      challengeId,
      assigneeId,
    })

    expect(foundProcess).toEqual(createdProgress)
  })
})

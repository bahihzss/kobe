import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { Progress } from '@domain/progress'
import { ProgressId } from '@domain/progress/progress-id'
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

  test('save で保存したものを findById で取得できる', async () => {
    const challengeId = new ChallengeId(PrismaSeeder.data.challenge.id)
    const assigneeId = new ParticipantId(PrismaSeeder.data.participant.id)
    const progressId = ProgressId.compositeFrom(challengeId, assigneeId)
    const createdProgress = Progress.assign({
      challengeId,
      assigneeId,
    })

    await progressRepository.save(createdProgress)
    const foundProcess = await progressRepository.findById(progressId)

    expect(foundProcess).toEqual(createdProgress)
  })

  test('存在しない場合は undefined を返す', async () => {
    const progressId = ProgressId.compositeFrom(new ChallengeId(), new ParticipantId())

    const foundProcess = await progressRepository.findById(progressId)

    expect(foundProcess).toBeUndefined()
  })
})

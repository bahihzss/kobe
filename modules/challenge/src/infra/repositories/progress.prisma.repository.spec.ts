import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { Progress, ProgressStatus } from '@domain/progress'
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

  test('insertMany で一括追加したものを findById で取得できる', async () => {
    const progress1 = Progress.create({
      challengeId: new ChallengeId(PrismaSeeder.data.challenge.id),
      assigneeId: new ParticipantId(PrismaSeeder.data.newParticipants[0].id),
    })
    const progress2 = Progress.create({
      challengeId: new ChallengeId(PrismaSeeder.data.challenge.id),
      assigneeId: new ParticipantId(PrismaSeeder.data.newParticipants[1].id),
    })

    await progressRepository.insertMany([progress1, progress2])

    const foundProcess1 = await progressRepository.findById(progress1.id)
    expect(foundProcess1?.serialize().status).toEqual('TODO')

    const foundProcess2 = await progressRepository.findById(progress2.id)
    expect(foundProcess2?.serialize().status).toEqual('TODO')
  })

  test('update で指定した課題進捗を更新できる', async () => {
    const rawProgress = PrismaSeeder.data.progresses[0]
    const assigneeId = new ParticipantId(rawProgress.assigneeId)
    const progress = Progress.reconstruct({
      challengeId: new ChallengeId(rawProgress.challengeId),
      assigneeId,
      status: new ProgressStatus(rawProgress.status),
    })
    const inprogress = progress.start({ operatorId: assigneeId })

    await progressRepository.update(inprogress)

    const foundProcess = await progressRepository.findById(inprogress.id)
    expect(foundProcess?.serialize().status).toEqual('IN_PROGRESS')
  })

  test('存在しない場合は undefined を返す', async () => {
    const progressId = ProgressId.compositeFrom(new ChallengeId(), new ParticipantId())

    const foundProcess = await progressRepository.findById(progressId)

    expect(foundProcess).toBeUndefined()
  })
})

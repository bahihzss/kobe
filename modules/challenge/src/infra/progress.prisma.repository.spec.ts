import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { Progress } from '@domain/progress'
import { PrismaService } from '@infra/prisma.service'
import { ProgressPrismaRepository } from '@infra/progress.prisma.repository'
import { Test } from '@nestjs/testing'

describe('ProgressPrismaRepository', () => {
  let progressRepository: ProgressPrismaRepository

  beforeEach(async () => {
    const testApp = await Test.createTestingModule({
      providers: [PrismaService, ProgressPrismaRepository],
    }).compile()

    progressRepository = testApp.get(ProgressPrismaRepository)
    const prisma = testApp.get(PrismaService)

    await prisma.progress.deleteMany({})

    await prisma.challenge.deleteMany({})
    await prisma.challenge.create({
      data: {
        id: '01H3SDXMQZYV5E40MCE6QX6T59',
        title: 'DBモデリング1',
        description: 'お寿司屋さんのシステムのDBを設計してください。',
      },
    })

    await prisma.participant.deleteMany({})
    await prisma.participant.create({
      data: {
        id: '01H3SDZF9SGZTFCKP39N4V16G5',
        name: 'Kawamoto Yuto',
      },
    })
  })

  test('save で保存したものを findByChallengeAndAssignee で取得できる', async () => {
    const challengeId = new ChallengeId('01H3SDXMQZYV5E40MCE6QX6T59')
    const assigneeId = new ParticipantId('01H3SDZF9SGZTFCKP39N4V16G5')
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

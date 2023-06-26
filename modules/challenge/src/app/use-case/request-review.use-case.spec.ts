import { RequestReviewUseCase } from '@app/use-case'
import { PrismaSeeder } from '@infra/prisma.seeder'
import { PrismaService } from '@infra/prisma.service'
import { ProgressPrismaRepository } from '@infra/repositories'
import { Test, TestingModule } from '@nestjs/testing'
import { Token } from '@root/token'

describe('RequestReviewUseCase', () => {
  let requestReviewUseCase: RequestReviewUseCase
  let prisma: PrismaService

  beforeEach(async () => {
    const testApp = await Test.createTestingModule({
      providers: [
        PrismaService,
        PrismaSeeder,
        {
          provide: Token.ProgressRepository,
          useClass: ProgressPrismaRepository,
        },
        RequestReviewUseCase,
      ],
    }).compile()

    await testApp.get(PrismaSeeder).seed()

    requestReviewUseCase = testApp.get(RequestReviewUseCase)
    prisma = testApp.get(PrismaService)
  })

  test('課題と参加者を指定すると、課題のステータスがレビュー中になる', async () => {
    const challengeId = PrismaSeeder.data.challenge.id
    const assigneeId = PrismaSeeder.data.participant.id

    await requestReviewUseCase.execute({
      challengeId,
      assigneeId,
    })

    const progress = await prisma.progress.findUnique({
      where: {
        assigneeId_challengeId: {
          assigneeId,
          challengeId,
        },
      },
    })

    expect(progress?.status).toBe('IN_REVIEW')
  })
})

import { CompleteChallengeUseCase } from '@app/usecase/complete-challenge.use-case'
import { PrismaSeeder } from '@infra/prisma.seeder'
import { PrismaService } from '@infra/prisma.service'
import { ProgressPrismaRepository } from '@infra/progress.prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { Token } from '@root/token'

describe('CompleteChallengeUseCase', () => {
  let completeChallengeUseCase: CompleteChallengeUseCase
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
        CompleteChallengeUseCase,
      ],
    }).compile()

    await testApp.get(PrismaSeeder).seed()

    completeChallengeUseCase = testApp.get(CompleteChallengeUseCase)
    prisma = testApp.get(PrismaService)
  })

  test('課題と参加者を指定すると、課題のステータスが完了になる', async () => {
    const challengeId = PrismaSeeder.data.challenge.id
    const assigneeId = PrismaSeeder.data.participant.id

    await completeChallengeUseCase.execute({
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

    expect(progress?.status).toBe('DONE')
  })
})

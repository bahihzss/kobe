import { StartChallengeUseCase } from '@app/use-case'
import { PrismaSeeder } from '@infra/prisma.seeder'
import { PrismaService } from '@infra/prisma.service'
import { ProgressPrismaRepository } from '@infra/repositories'
import { Test, TestingModule } from '@nestjs/testing'
import { Token } from '@root/token'

describe('StartChallengeUseCase', () => {
  let startChallengeUseCase: StartChallengeUseCase
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
        StartChallengeUseCase,
      ],
    }).compile()

    await testApp.get(PrismaSeeder).seed()

    startChallengeUseCase = testApp.get(StartChallengeUseCase)
    prisma = testApp.get(PrismaService)
  })

  test('課題と参加者を指定すると、課題のステータスが進行中になる', async () => {
    const challengeId = PrismaSeeder.data.challenge.id
    const assigneeId = PrismaSeeder.data.participant.id

    await startChallengeUseCase.execute({
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

    expect(progress?.status).toBe('IN_PROGRESS')
  })
})

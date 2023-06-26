import { ChallengeId } from '@domain/challenge'
import { ProgressStatus } from '@domain/progress'
import { PrismaSeeder } from '@infra/prisma.seeder'
import { PrismaService } from '@infra/prisma.service'
import { ListProgressesPrismaQueryService } from '@infra/query-services/list-progresses.prisma.query-service'
import { Test } from '@nestjs/testing'
import { Token } from '@root/token'

describe('ListProgressesPrismaQueryService', () => {
  let queryService: ListProgressesPrismaQueryService

  beforeEach(async () => {
    const testApp = await Test.createTestingModule({
      providers: [
        PrismaService,
        PrismaSeeder,
        {
          provide: Token.ListProgressQueryService,
          useClass: ListProgressesPrismaQueryService,
        },
      ],
    }).compile()

    await testApp.get(PrismaSeeder).seed()

    queryService = testApp.get(Token.ListProgressQueryService)
  })

  const getExpectedProgresses = (challengeIds: ChallengeId[], status: ProgressStatus, page: number) => {
    return PrismaSeeder.data.progresses
      .filter((progress) => {
        return (
          challengeIds.find((challengeId) => challengeId.equals(new ChallengeId(progress.challengeId))) &&
          progress.status === status.value
        )
      })
      .map((progress) => {
        const challenge = PrismaSeeder.data.challenges.find((challenge) => challenge.id === progress.challengeId)
        const assignee = PrismaSeeder.data.participants.find((participant) => participant.id === progress.assigneeId)

        if (!challenge || !assignee) {
          throw new Error('シーダーに想定外のデータが存在します')
        }

        return {
          assignee: {
            name: assignee.name,
          },
          challenge: {
            title: challenge.title,
          },
        }
      })
      .slice((page - 1) * 10, page * 10)
  }

  test('課題（複数可）とステータスとページを指定すると、１０件ずつ条件に一致する課題進捗を取得できる', async () => {
    const challengeIds = PrismaSeeder.data.challenges.map((challenge) => new ChallengeId(challenge.id))

    const listedProgressesDto = await queryService.list({
      challengeIds,
      status: ProgressStatus.todo,
      page: 1,
    })

    const expectedProgresses = getExpectedProgresses(challengeIds, ProgressStatus.todo, 1)

    expect(listedProgressesDto).toEqual({
      page: 1,
      progresses: expectedProgresses,
    })
  })

  test('２ページ目も取得できる', async () => {
    const challengeIds = PrismaSeeder.data.challenges.map((challenge) => new ChallengeId(challenge.id))

    const listedProgressesDto = await queryService.list({
      challengeIds,
      status: ProgressStatus.todo,
      page: 2,
    })

    const expectedProgresses = getExpectedProgresses(challengeIds, ProgressStatus.todo, 2)

    expect(listedProgressesDto).toEqual({
      page: 2,
      progresses: expectedProgresses,
    })
  })
})

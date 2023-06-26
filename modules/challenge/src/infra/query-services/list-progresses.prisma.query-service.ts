import { ListedProgressesDto, ListProgressesQuery, ListProgressesQueryService } from '@app/query-service'
import { PrismaService } from '@infra/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ListProgressesPrismaQueryService implements ListProgressesQueryService {
  constructor(private prisma: PrismaService) {}

  async list(query: ListProgressesQuery): Promise<ListedProgressesDto> {
    const progresses = await this.prisma.progress.findMany({
      select: {
        assignee: {
          select: {
            name: true,
          },
        },
        challenge: {
          select: {
            title: true,
          },
        },
      },
      where: {
        challengeId: {
          in: query.challengeIds.map((challengeId) => challengeId.value),
        },
        status: query.status.value,
      },
      orderBy: [
        {
          challengeId: 'asc',
        },
        {
          assigneeId: 'asc',
        },
      ],
      skip: (query.page - 1) * 10,
      take: 10,
    })

    return {
      page: query.page,
      progresses,
    }
  }
}

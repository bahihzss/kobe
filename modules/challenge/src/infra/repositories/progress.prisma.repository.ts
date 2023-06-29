import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { Progress, ProgressRepository, ProgressStatus } from '@domain/progress'
import { ProgressId } from '@domain/progress/progress-id'
import { PrismaService } from '@infra/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ProgressPrismaRepository implements ProgressRepository {
  constructor(private prisma: PrismaService) {}

  async save(progress: Progress) {
    const serialized = progress.serialize()

    await this.prisma.progress.upsert({
      where: {
        assigneeId_challengeId: {
          assigneeId: serialized.assigneeId,
          challengeId: serialized.challengeId,
        },
      },
      update: {
        ...serialized,
      },
      create: {
        ...serialized,
      },
    })
  }

  async findById(id: ProgressId) {
    const rawProgress = await this.prisma.progress.findUnique({
      where: {
        assigneeId_challengeId: {
          assigneeId: id.assigneeId.value,
          challengeId: id.challengeId.value,
        },
      },
    })

    return rawProgress
      ? Progress.reconstruct({
          assigneeId: new ParticipantId(rawProgress.assigneeId),
          challengeId: new ChallengeId(rawProgress.challengeId),
          status: new ProgressStatus(rawProgress.status),
        })
      : undefined
  }

  async findByChallengeAndAssignee(params: { challengeId: ChallengeId; assigneeId: ParticipantId }) {
    const rawProgress = await this.prisma.progress.findUnique({
      where: {
        assigneeId_challengeId: {
          assigneeId: params.assigneeId.value,
          challengeId: params.challengeId.value,
        },
      },
    })

    return rawProgress
      ? Progress.reconstruct({
          assigneeId: new ParticipantId(rawProgress.assigneeId),
          challengeId: new ChallengeId(rawProgress.challengeId),
          status: new ProgressStatus(rawProgress.status),
        })
      : undefined
  }
}

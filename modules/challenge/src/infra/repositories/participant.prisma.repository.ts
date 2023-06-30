import { Participant } from '@domain/participant'
import { ParticipantRepository } from '@domain/participant/participant.repository'
import { PrismaService } from '@infra/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ParticipantPrismaRepository implements ParticipantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(participant: Participant) {
    const serialized = participant.serialize()

    await this.prisma.participant.upsert({
      where: {
        id: serialized.id,
      },
      update: {
        ...serialized,
      },
      create: {
        ...serialized,
      },
    })
  }
}

import { Challenge, ChallengeDescription, ChallengeId, ChallengeTitle } from '@domain/challenge'
import { ChallengeRepository } from '@domain/challenge/challenge.repository'
import { PrismaService } from '@infra/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChallengePrismaRepository implements ChallengeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listAll(): Promise<Challenge[]> {
    const rawChallenges = await this.prisma.challenge.findMany()

    return rawChallenges.map((rawChallenge) =>
      Challenge.reconstruct({
        id: new ChallengeId(rawChallenge.id),
        title: new ChallengeTitle(rawChallenge.title),
        description: new ChallengeDescription(rawChallenge.description),
      }),
    )
  }
}

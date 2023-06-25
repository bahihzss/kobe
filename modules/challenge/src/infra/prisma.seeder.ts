import { PrismaService } from '@infra/prisma.service'
import { Injectable } from '@nestjs/common'

const challenges = [
  {
    id: '01H3SDXMQZYV5E40MCE6QX6T59',
    title: 'DBモデリング1',
    description: 'お寿司屋さんのシステムのDBを設計してください。',
  },
]
const participants = [
  {
    id: '01H3SDZF9SGZTFCKP39N4V16G5',
    name: 'Kawamoto Yuto',
  },
]
const progresses = challenges
  .map((challenge) => {
    return participants.map((participant) => ({
      assigneeId: participant.id,
      challengeId: challenge.id,
      status: 'TODO',
    }))
  })
  .flat()

@Injectable()
export class PrismaSeeder {
  static data = {
    challenges,
    participants,
    progresses,
    challenge: challenges[0],
    participant: participants[0],
  }

  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    await this.prisma.progress.deleteMany({})
    await this.prisma.challenge.deleteMany({})
    await this.prisma.participant.deleteMany({})

    await this.prisma.challenge.createMany({
      data: PrismaSeeder.data.challenges,
    })
    await this.prisma.participant.createMany({
      data: PrismaSeeder.data.participants,
    })
    await this.prisma.progress.createMany({
      data: PrismaSeeder.data.progresses,
    })
  }
}

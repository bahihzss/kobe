import { PrismaService } from '@infra/prisma.service'
import { Injectable } from '@nestjs/common'
import { Challenge, Participant, Progress } from '@prisma/client'

const challenges: Challenge[] = [
  {
    id: '01H3TA360MRTAW6RTRRE4XDYPN',
    title: 'DBモデリング1',
    description: 'お寿司屋さんのシステムのDBを設計してください。',
  },
  {
    id: '01H3TC4K3S8E3N0XPBTY6WF359',
    title: 'DBモデリング2',
    description: 'チャットアプリのDBを設計してください。',
  },
  {
    id: '01H3TC8C42JAVH65W7ZM6KXGMC',
    title: 'DBモデリング3',
    description: 'ドキュメント管理システムのDBを設計してください。',
  },
]
const participants: Participant[] = [
  {
    id: '01H3SDXMQZYV5E40MCE6QX6T59',
    name: 'Kawamoto Yuto',
  },
  {
    id: '01H3TC2JJYWF1NBPQHVA34WCTW',
    name: 'Furuno Shota',
  },
  {
    id: '01H3TC30WZSZAEQJ4PGE74FQSN',
    name: 'Inafune Hikaru',
  },
  {
    id: '01H3TC3R0CWM7V4PBVFXZ5XR32',
    name: 'Yamashita Norio',
  },
]
const progresses: Progress[] = challenges
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

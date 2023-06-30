import { Participant, ParticipantName } from '@domain/participant'
import { PrismaSeeder } from '@infra/prisma.seeder'
import { PrismaService } from '@infra/prisma.service'
import { ParticipantPrismaRepository } from '@infra/repositories/participant.prisma.repository'
import { Test } from '@nestjs/testing'

describe('ParticipantPrismaRepository', () => {
  let participantRepository: ParticipantPrismaRepository
  let prisma: PrismaService

  beforeEach(async () => {
    const testApp = await Test.createTestingModule({
      providers: [PrismaService, PrismaSeeder, ParticipantPrismaRepository],
    }).compile()

    await testApp.get(PrismaSeeder).seed()

    participantRepository = testApp.get(ParticipantPrismaRepository)
    prisma = testApp.get(PrismaService)
  })

  test('save で保存できる', async () => {
    const participant = Participant.create({
      name: new ParticipantName('Yuto Kawamoto'),
    })

    await participantRepository.save(participant)
  })
})

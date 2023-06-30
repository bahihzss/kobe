import { ParticipantEnrolledHandler } from '@app/event-handler/participant-enrolled.event-handler'
import {
  CompleteChallengeUseCase,
  ListProgressesUseCase,
  RequestReviewUseCase,
  StartChallengeUseCase,
} from '@app/use-case'
import { PrismaSeeder } from '@infra/prisma.seeder'
import { PrismaService } from '@infra/prisma.service'
import { ListProgressesPrismaQueryService } from '@infra/query-services'
import { ProgressPrismaRepository } from '@infra/repositories'
import { ChallengePrismaRepository } from '@infra/repositories/challenge.prisma.repository'
import { ParticipantPrismaRepository } from '@infra/repositories/participant.prisma.repository'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import {
  CompleteChallengeController,
  ListProgressesController,
  RequestReviewController,
  StartChallengeController,
} from '@presentation/controllers'
import { RefreshController } from '@presentation/controllers/refresh.controller'
import { Token } from '@root/token'

@Module({
  imports: [CqrsModule],
  providers: [
    PrismaService,
    PrismaSeeder,

    // use-case
    StartChallengeUseCase,
    RequestReviewUseCase,
    CompleteChallengeUseCase,
    ListProgressesUseCase,

    // query service
    {
      provide: Token.ListProgressQueryService,
      useClass: ListProgressesPrismaQueryService,
    },

    // repository
    {
      provide: Token.ParticipantRepository,
      useClass: ParticipantPrismaRepository,
    },
    {
      provide: Token.ChallengeRepository,
      useClass: ChallengePrismaRepository,
    },
    {
      provide: Token.ProgressRepository,
      useClass: ProgressPrismaRepository,
    },

    ParticipantEnrolledHandler,
  ],
  controllers: [
    StartChallengeController,
    RequestReviewController,
    CompleteChallengeController,
    ListProgressesController,
    RefreshController,
  ],
})
export class ChallengeModule {}

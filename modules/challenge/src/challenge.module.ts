import {
  CompleteChallengeUseCase,
  ListProgressesUseCase,
  RequestReviewUseCase,
  StartChallengeUseCase,
} from '@app/use-case'
import { PrismaService } from '@infra/prisma.service'
import { ListProgressesPrismaQueryService } from '@infra/query-services'
import { ProgressPrismaRepository } from '@infra/repositories'
import { Module } from '@nestjs/common'
import {
  CompleteChallengeController,
  ListProgressesController,
  RequestReviewController,
  StartChallengeController,
} from '@presentation/controllers'
import { Token } from '@root/token'

@Module({
  providers: [
    PrismaService,

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
      provide: Token.ProgressRepository,
      useClass: ProgressPrismaRepository,
    },
  ],
  controllers: [
    StartChallengeController,
    RequestReviewController,
    CompleteChallengeController,
    ListProgressesController,
  ],
})
export class ChallengeModule {}

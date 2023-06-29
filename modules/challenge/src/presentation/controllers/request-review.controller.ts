import { RequestReviewUseCase } from '@app/use-case'
import { Controller, Patch, Headers, HttpCode, Param } from '@nestjs/common'
import { IsULID } from '@yuzu441/is-ulid'

class RequestReviewPathParams {
  @IsULID()
  challengeId!: string
}

@Controller('/challenges/:challengeId/request-review')
export class RequestReviewController {
  constructor(private readonly requestReviewUseCase: RequestReviewUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param() request: RequestReviewPathParams, @Headers('x-participant-id') participantId: string) {
    await this.requestReviewUseCase.execute({
      challengeId: request.challengeId,
      assigneeId: participantId,
    })
  }
}

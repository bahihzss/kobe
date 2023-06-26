import { RequestReviewUseCase } from '@app/use-case'
import { Body, Controller, Patch, Headers, HttpCode } from '@nestjs/common'
import { IsULID } from '@yuzu441/is-ulid'

class RequestReviewRequest {
  @IsULID()
  challengeId!: string
}

@Controller('/challenges/:challengeId/request-review')
export class RequestReviewController {
  constructor(private readonly requestReviewUseCase: RequestReviewUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Body() request: RequestReviewRequest, @Headers('x-participant-id') participantId: string) {
    await this.requestReviewUseCase.execute({
      challengeId: request.challengeId,
      assigneeId: participantId,
    })
  }
}

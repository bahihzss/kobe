import { CompleteChallengeUseCase } from '@app/use-case'
import { Body, Controller, Patch, Headers, HttpCode } from '@nestjs/common'
import { IsULID } from '@yuzu441/is-ulid'

class CompleteChallengeRequest {
  @IsULID()
  challengeId!: string
}

@Controller('/challenges/:challengeId/start')
export class CompleteChallengeController {
  constructor(private readonly completeChallengeUseCase: CompleteChallengeUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Body() request: CompleteChallengeRequest, @Headers('x-participant-id') participantId: string) {
    await this.completeChallengeUseCase.execute({
      challengeId: request.challengeId,
      assigneeId: participantId,
    })
  }
}

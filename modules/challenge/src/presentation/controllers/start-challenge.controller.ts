import { StartChallengeUseCase } from '@app/use-case'
import { Body, Controller, Patch, Headers, HttpCode } from '@nestjs/common'
import { IsULID } from '@yuzu441/is-ulid'

class StartChallengeRequest {
  @IsULID()
  challengeId!: string
}

@Controller('/challenges/:challengeId/start')
export class StartChallengeController {
  constructor(private readonly startChallengeUseCase: StartChallengeUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Body() request: StartChallengeRequest, @Headers('x-participant-id') participantId: string) {
    await this.startChallengeUseCase.execute({
      challengeId: request.challengeId,
      assigneeId: participantId,
    })
  }
}

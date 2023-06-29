import { StartChallengeUseCase } from '@app/use-case'
import { Controller, Patch, Headers, HttpCode, Param } from '@nestjs/common'
import { IsULID } from '@yuzu441/is-ulid'

class StartChallengePathParam {
  @IsULID()
  challengeId!: string
}

@Controller('/challenges/:challengeId/start')
export class StartChallengeController {
  constructor(private readonly startChallengeUseCase: StartChallengeUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param() request: StartChallengePathParam, @Headers('x-participant-id') participantId: string) {
    await this.startChallengeUseCase.execute({
      challengeId: request.challengeId,
      assigneeId: participantId,
    })
  }
}

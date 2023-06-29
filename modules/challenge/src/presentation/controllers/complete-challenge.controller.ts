import { CompleteChallengeUseCase } from '@app/use-case'
import { Controller, Patch, Headers, HttpCode, Param } from '@nestjs/common'
import { IsULID } from '@yuzu441/is-ulid'

class CompleteChallengePathParam {
  @IsULID()
  challengeId!: string
}

@Controller('/challenges/:challengeId/complete')
export class CompleteChallengeController {
  constructor(private readonly completeChallengeUseCase: CompleteChallengeUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param() request: CompleteChallengePathParam, @Headers('x-participant-id') participantId: string) {
    await this.completeChallengeUseCase.execute({
      challengeId: request.challengeId,
      assigneeId: participantId,
    })
  }
}

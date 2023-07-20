import { EnrollNewParticipantUseCase } from '@app/use-case'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { IsString } from 'class-validator'

export class EnrollNewParticipantRequest {
  @IsString()
  name!: string

  @IsString()
  email!: string
}

@Controller('/participants')
export class EnrollNewParticipantController {
  constructor(private readonly enrollNewParticipantUseCase: EnrollNewParticipantUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() request: EnrollNewParticipantRequest) {
    try {
      await this.enrollNewParticipantUseCase.execute({
        name: request.name,
        email: request.email,
      })
    } catch (e) {}

    return {
      statusCode: 201,
      status: 'created',
    }
  }
}

import { EnrollNewParticipantUseCase } from '@app/use-case'
import { EmailDuplicatedException } from '@domain/participant/services/email-duplicated.exception'
import { Body, Controller, HttpCode, HttpException, Post } from '@nestjs/common'
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
    } catch (e) {
      if (e instanceof EmailDuplicatedException) {
        throw new HttpException(
          {
            statusCode: 409,
            message: 'すでに登録されているメールアドレスです。',
          },
          409,
        )
      }
    }

    return {
      statusCode: 201,
      status: 'created',
    }
  }
}

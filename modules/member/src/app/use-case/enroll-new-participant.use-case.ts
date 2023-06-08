import { EnrollNewParticipantCommand } from '@domain/participant/commands'
import { ParticipantName } from '@domain/participant/models'
import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'

export interface EnrollNewParticipantUseCaseParams {
  name: string
}

@Injectable()
export class EnrollNewParticipantUseCase {
  constructor(private commandBus: CommandBus) {}

  async execute(params: EnrollNewParticipantUseCaseParams) {
    const command = new EnrollNewParticipantCommand(new ParticipantName(params.name))
    await this.commandBus.execute(command)
  }
}

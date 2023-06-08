import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

export class EnrollNewParticipantCommand {}

@CommandHandler(EnrollNewParticipantCommand)
export class EnrollNewParticipantCommandHandler implements ICommandHandler {
  async execute(command: EnrollNewParticipantCommand) {}
}

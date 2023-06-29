import { ParticipantRepository } from '@domain/participant/interfaces'
import { Participant, ParticipantEmail, ParticipantName } from '@domain/participant/models'
import { Inject } from '@nestjs/common'
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { Token } from '@root/token'

export class EnrollNewParticipantCommand {
  constructor(public readonly name: ParticipantName, public email: ParticipantEmail) {}
}

@CommandHandler(EnrollNewParticipantCommand)
export class EnrollNewParticipantCommandHandler implements ICommandHandler {
  constructor(
    private eventBus: EventBus,
    @Inject(Token.ParticipantRepository)
    private participantRepository: ParticipantRepository,
  ) {}

  async execute(command: EnrollNewParticipantCommand) {
    const [participant, participantEnrolled] = Participant.enroll({
      name: command.name,
      email: command.email,
    })

    await this.participantRepository.store(participant, participantEnrolled)
    this.eventBus.publish(participantEnrolled)
  }
}

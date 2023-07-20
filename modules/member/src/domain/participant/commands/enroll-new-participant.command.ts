import { ParticipantRepository } from '@domain/participant/interfaces'
import { Participant, ParticipantEmail, ParticipantName } from '@domain/participant/models'
import { EmailDuplicationChecker } from '@domain/participant/services/email-duplication-checker'
import { DomainException } from '@kobe/common/domain'
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
    private emailDuplicationChecker: EmailDuplicationChecker,
  ) {}

  async execute(command: EnrollNewParticipantCommand) {
    await this.emailDuplicationChecker.throwIfDuplicate(command.email)

    const [participant, participantEnrolled] = Participant.enroll({
      name: command.name,
      email: command.email,
    })

    await this.participantRepository.store(participant, participantEnrolled)
    this.eventBus.publish(participantEnrolled)
  }
}

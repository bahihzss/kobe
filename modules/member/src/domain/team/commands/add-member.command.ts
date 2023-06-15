import { ParticipantId } from '@domain/participant/models'
import { TeamRepository } from '@domain/team/interfaces'
import { OpenTeamFinder } from '@domain/team/services'
import { Inject } from '@nestjs/common'
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { Token } from '@root/token'

export class AddMemberCommand {
  constructor(public readonly participantId: ParticipantId) {}
}

@CommandHandler(AddMemberCommand)
export class AddMemberCommandHandler implements ICommandHandler<AddMemberCommand> {
  constructor(
    @Inject(Token.TeamRepository)
    private readonly teamRepository: TeamRepository,
    private readonly openTeamFinder: OpenTeamFinder,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddMemberCommand) {
    const openTeam = await this.openTeamFinder.find()
    const [addedTeam, teamMemberAdded] = openTeam.addMember(command.participantId)

    await this.teamRepository.store(addedTeam, teamMemberAdded)
    this.eventBus.publish(teamMemberAdded)
  }
}

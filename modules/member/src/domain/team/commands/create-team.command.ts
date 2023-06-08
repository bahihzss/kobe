import { TeamRepository } from '@domain/team/interfaces'
import { Team } from '@domain/team/models'
import { TeamMembers } from '@domain/team/models/team-members'
import { Inject } from '@nestjs/common'
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { Token } from '@root/token'

export class CreateTeamCommand {
  constructor(public members: TeamMembers) {}
}

@CommandHandler(CreateTeamCommand)
export class CreateTeamCommandHandler implements ICommandHandler<CreateTeamCommand> {
  constructor(
    @Inject(Token.TeamRepository)
    private teamRepository: TeamRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: CreateTeamCommand) {
    const latestTeam = await this.teamRepository.findLatest()
    const [team, teamCreated] = Team.create({ latestTeam, members: command.members })

    await this.teamRepository.store(team, teamCreated)
    this.eventBus.publish(teamCreated)
  }
}

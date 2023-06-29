import { PairRepository } from '@domain/pair/interfaces'
import { ParticipantId } from '@domain/participant/models'
import { TeamId } from '@domain/team/models'
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'

export class AddPairMemberCommand {
  constructor(public readonly teamId: TeamId, public readonly newMemberId: ParticipantId) {}
}

@CommandHandler(AddPairMemberCommand)
export class AddPairMemberCommandHandler implements ICommandHandler<AddPairMemberCommand> {
  constructor(
    private readonly pairRepository: PairRepository,
    // private readonly openPairFinder: OpenPairFinder,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddPairMemberCommand) {
    // const openPair = this.openPairFinder.find(command.teamId)
    // const [addedPair, pairMemberAdded] = openPair.addMember(command.newMemberId)
    //
    // await this.pairRepository.store(addedPair, pairMemberAdded)
    // this.eventBus.publish(pairMemberAdded)
  }
}

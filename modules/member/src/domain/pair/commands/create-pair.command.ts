import { PairRepository } from '@domain/pair/interfaces'
import { Pair } from '@domain/pair/models'
import { TeamId } from '@domain/team/models'
import { Inject } from '@nestjs/common'
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { Token } from '@root/token'

export class CreatePairCommand {
  constructor(public teamId: TeamId) {}
}

@CommandHandler(CreatePairCommand)
export class CreatePairCommandHandler implements ICommandHandler<CreatePairCommand> {
  constructor(
    @Inject(Token.PairRepository)
    private pairRepository: PairRepository,
    private eventBus: EventBus,
  ) {}

  async execute(event: CreatePairCommand) {
    const latestPair = await this.pairRepository.findLatest(event.teamId)
    const [pair, pairCreated] = Pair.create(event.teamId, latestPair)

    await this.pairRepository.store(pair, pairCreated)
    this.eventBus.publish(pairCreated)
  }
}

import { ChallengeRepository } from '@domain/challenge/challenge.repository'
import { Participant, ParticipantName, ParticipantRepository } from '@domain/participant'
import { ProgressRepository } from '@domain/progress'
import { Event as MemberEvent } from '@kobe/member'
import { Inject } from '@nestjs/common'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Token } from '@root/token'

@EventsHandler(MemberEvent.ParticipantEnrolled)
export class ParticipantEnrolledHandler implements IEventHandler<MemberEvent.ParticipantEnrolled> {
  constructor(
    @Inject(Token.ParticipantRepository)
    private readonly participantRepository: ParticipantRepository,
    @Inject(Token.ChallengeRepository)
    private readonly challengeRepository: ChallengeRepository,
    @Inject(Token.ProgressRepository)
    private readonly progressRepository: ProgressRepository,
  ) {}

  async handle(event: MemberEvent.ParticipantEnrolled) {
    const participant = Participant.create({ name: new ParticipantName(event.name.value) })
    await this.participantRepository.save(participant)

    const challenges = await this.challengeRepository.listAll()
    const progresses = challenges.map((challenge) => challenge.assign(participant.id))

    await this.progressRepository.insertMany(progresses)
  }
}

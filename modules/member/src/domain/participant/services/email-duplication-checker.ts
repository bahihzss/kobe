import { ParticipantRepository } from '@domain/participant/interfaces'
import { ParticipantEmail } from '@domain/participant/models'
import { Inject, Injectable } from '@nestjs/common'
import { Token } from '@root/token'

@Injectable()
export class EmailDuplicationChecker {
  constructor(
    @Inject(Token.ParticipantRepository)
    private readonly participantRepository: ParticipantRepository,
  ) {}

  async isDuplicate(email: ParticipantEmail) {
    const participant = await this.participantRepository.findByEmail(email)
    return typeof participant !== 'undefined'
  }
}

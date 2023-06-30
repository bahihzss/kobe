import { ChallengeDescription } from '@domain/challenge/challenge-description'
import { ChallengeId } from '@domain/challenge/challenge-id'
import { ChallengeTitle } from '@domain/challenge/challenge-title'
import { ParticipantId } from '@domain/participant'
import { Progress } from '@domain/progress'
import { IEntity } from '@kobe/common/domain'

export class Challenge implements IEntity {
  private constructor(
    private readonly id: ChallengeId,
    private readonly title: ChallengeTitle,
    private readonly description: ChallengeDescription,
  ) {}

  static create(param: { description: ChallengeDescription; title: ChallengeTitle }) {
    return new Challenge(new ChallengeId(), param.title, param.description)
  }

  assign(assigneeId: ParticipantId) {
    return Progress.create({ challengeId: this.id, assigneeId })
  }

  static reconstruct(param: { description: ChallengeDescription; id: ChallengeId; title: ChallengeTitle }) {
    return new Challenge(param.id, param.title, param.description)
  }

  serialize() {
    return {
      id: this.id.value,
      title: this.title.value,
      description: this.description.value,
    }
  }
}

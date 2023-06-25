import { ParticipantId } from '@domain/participant/participant-id'
import { ParticipantName } from '@domain/participant/participant-name'
import { BaseUlid, IEntity } from '@kobe/common/domain'

export class Participant implements IEntity {
  constructor(private id: ParticipantId, private readonly name: ParticipantName) {}

  static create(params: { name: ParticipantName }): Participant {
    return new Participant(new ParticipantId(), params.name)
  }

  static reconstruct(param: { name: ParticipantName; id: ParticipantId }) {
    return new Participant(param.id, param.name)
  }

  serialize() {
    return {
      id: this.id.value,
      name: this.name.value,
    }
  }
}

import { DomainValidationError, IValue } from '@kobe/common/domain'

const statuses = ['在籍中', '休会中', '退会済'] as const
type ParticipantStatusValue = typeof statuses[number]

export class ParticipantStatus implements IValue<ParticipantStatusValue> {
  type = 'ParticipantStatus' as const

  constructor(public readonly value: ParticipantStatusValue) {
    this.validate(value)
  }

  static get enrolled() {
    return new ParticipantStatus('在籍中')
  }

  static get suspended() {
    return new ParticipantStatus('休会中')
  }

  static get resigned() {
    return new ParticipantStatus('退会済')
  }

  private validate(value: any) {
    if (!statuses.includes(value)) {
      throw new DomainValidationError(`${value} は正しいステータスではありません。`)
    }
  }

  equals(other: IValue<ParticipantStatusValue>): boolean {
    return this.value === other.value
  }
}

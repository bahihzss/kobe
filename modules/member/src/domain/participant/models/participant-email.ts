import { DomainValidationError, IValue } from '@kobe/common/domain'

export class ParticipantEmail implements IValue<string> {
  type = 'ParticipantEmail' as const

  constructor(public readonly value: string) {
    this.validation(value)
  }

  private validation(value: string): void {
    const isValid = /^[\w+\-.]+@[a-z\d\-.]+\.[a-z]+$/i.test(value)

    if (!isValid) {
      throw new DomainValidationError(`${value} は正しいメールの形式ではありません。`)
    }
  }

  equals(other: ParticipantEmail): boolean {
    return this.value === other.value
  }
}

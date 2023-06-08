import { DomainValidationError, IValue } from '@kobe/common/domain'
import { DomainException } from '@kobe/common/domain/error'
import { patterns } from '@kobe/patterns'

export class TeamName implements IValue<string> {
  type = 'TeamName' as const

  private static firstText = '1'

  constructor(public readonly value: string) {
    this.validate(value)
  }

  private validate(value) {
    if (typeof value !== 'string' || !patterns.teamName.test(value)) {
      throw new DomainValidationError(
        `${this.value} は不正なチーム名です。チーム名は 1 以上 999 以下の整数の文字列である必要があります`,
      )
    }
  }

  static get first() {
    return new TeamName(this.firstText)
  }

  private toNumber() {
    return Number(this.value)
  }

  private get isLast() {
    return this.toNumber() === 999
  }

  get next() {
    if (this.isLast) {
      throw new DomainException('チーム数は 999 までです')
    }

    const nextNumber = this.toNumber() + 1
    return new TeamName(nextNumber.toString())
  }

  equals(other: TeamName): boolean {
    return this.value === other.value
  }
}

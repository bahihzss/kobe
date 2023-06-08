import { DomainValidationError, IValue } from '@kobe/common/domain'
import { DomainException } from '@kobe/common/domain/error'
import { patterns } from '@kobe/patterns'

export class PairName implements IValue<string> {
  type = 'PairName' as const

  private static allNames = 'abcdefghijklmnopqrstuvwxyz'

  constructor(public readonly value: string) {
    this.validate(value)
  }

  private validate(value: any) {
    if (typeof value !== 'string' || !patterns.pairName.test(value)) {
      throw new DomainValidationError(
        `${value} は不正なペア名です。ペア名は 1 文字のアルファベットの小文字である必要があります`,
      )
    }
  }

  static get first() {
    return new PairName(this.allNames[0])
  }

  private get index() {
    return PairName.allNames.indexOf(this.value)
  }

  private get isLast() {
    return this.index === PairName.allNames.length - 1
  }

  get next() {
    if (this.isLast) {
      throw new DomainException('ペア名は z までです')
    }

    const nextIndex = this.index + 1
    return new PairName(PairName.allNames[nextIndex])
  }

  equals(target: PairName) {
    return this.value === target.value && this.type === target.type
  }
}

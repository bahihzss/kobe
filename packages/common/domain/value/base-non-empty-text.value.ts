import { DomainValidationError } from '../error'
import { IValue } from '../type'

export abstract class BaseNonEmptyText implements IValue<string> {
  abstract readonly type: string
  protected get label() {
    return 'テキスト'
  }

  constructor(readonly value: string) {
    this.validate(value)
  }

  protected validate(value: any) {
    const label = this.label ?? 'テキスト'

    if (typeof value !== 'string' || value.length === 0) {
      throw new DomainValidationError(
        `${this.value} は不正な${label}です。${label}は１文字以上の文字列である必要があります`,
      )
    }
  }

  equals<T extends BaseNonEmptyText>(this: T, other: T): boolean {
    return this.value === other.value && this.type === other.type
  }
}

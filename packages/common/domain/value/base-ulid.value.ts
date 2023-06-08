import { IValue } from '../type'
import { ulid } from 'ulid'
import { DomainValidationError } from '../error'
import { patterns } from '@kobe/patterns'

export abstract class BaseUlid implements IValue<string> {
  abstract readonly type: string

  constructor(readonly value: string = ulid()) {
    this.validate(value)
  }

  private validate(value: any) {
    if (typeof value !== 'string' || !patterns.ulid.test(value)) {
      throw new DomainValidationError(`${this.value} は不正な ULID です`)
    }
  }

  equals<T extends BaseUlid>(this: T, other: T): boolean {
    return this.value === other.value && this.type === other.type
  }
}

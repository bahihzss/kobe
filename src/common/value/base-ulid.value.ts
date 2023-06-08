import { IValue } from '../interface/value.interface'
import { ulid } from 'ulid'
import { DomainValidationError } from '../error/domain-validation.error'
import { regexp } from '@common/constant/regexp'

export abstract class BaseUlid implements IValue {
  constructor(readonly value: string = ulid()) {
    this.validate(value)
  }

  private validate(value: string) {
    if (typeof value !== 'string' || !regexp.ulid.test(value)) {
      throw new DomainValidationError(`${this.value} は不正な ULID です`)
    }
  }

  equals(other: BaseUlid): boolean {
    return this.value === other.value
  }
}

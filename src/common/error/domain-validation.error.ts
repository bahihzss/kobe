import { IValue } from '../interface/value.interface'

export class DomainValidationError extends Error {
  constructor(message) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DomainValidationError)
    }

    this.name = this.constructor.name
  }
}

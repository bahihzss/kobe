import { DomainException } from './domain-exception'

export class DomainValidationError extends DomainException {
  constructor(message) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DomainValidationError)
    }

    this.name = new.target.name
  }
}

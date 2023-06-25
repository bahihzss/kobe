export class DomainException extends Error {
  constructor(public message: string) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DomainException)
    }

    this.name = new.target.name
  }
}

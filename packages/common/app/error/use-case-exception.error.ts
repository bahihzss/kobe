export class UseCaseException extends Error {
  constructor(public message: string) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UseCaseException)
    }

    this.name = new.target.name
  }
}

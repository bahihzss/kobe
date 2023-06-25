export class ProgressAlreadyDoneException extends Error {
  constructor() {
    super('課題はすでに完了済みです')

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProgressAlreadyDoneException)
    }

    this.name = new.target.name
  }
}

export class ProgressInvalidOperatorException extends Error {
  constructor() {
    super('課題の進捗は割り当てられた参加者のみが変更できます')

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProgressInvalidOperatorException)
    }

    this.name = new.target.name
  }
}

export class NonOpenPairException extends Error {
  constructor() {
    super('空きのあるペアがありません')

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NonOpenPairException)
    }

    this.name = new.target.name
  }
}

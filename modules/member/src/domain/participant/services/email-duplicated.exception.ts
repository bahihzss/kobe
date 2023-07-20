import { DomainException } from '@kobe/common/domain'

export class EmailDuplicatedException extends DomainException {
  constructor() {
    super('すでに登録済みのメールアドレスです。')

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EmailDuplicatedException)
    }

    this.name = new.target.name
  }
}

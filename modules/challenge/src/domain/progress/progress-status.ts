import { ProgressAlreadyDoneException } from '@domain/progress/progress-already-done.exception'
import { DomainValidationError, IValue } from '@kobe/common/domain'

const progressStatusValue = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'] as const
type ProgressStatusValue = typeof progressStatusValue[number]

export class ProgressStatus implements IValue<ProgressStatusValue> {
  type = 'ProgressStatus' as const

  readonly value: ProgressStatusValue

  constructor(value: string) {
    this.validate(value)
    this.value = value as ProgressStatusValue
  }

  static get todo() {
    return new ProgressStatus('TODO')
  }

  private validate(value: any) {
    if (!progressStatusValue.includes(value)) {
      throw new DomainValidationError(`${value} は不正な進捗ステータスです`)
    }
  }

  equals<T extends ProgressStatus>(this: T, other: T): boolean {
    return this.value === other.value && this.type === other.type
  }

  start() {
    if (this.value === 'DONE') {
      throw new ProgressAlreadyDoneException()
    }

    return new ProgressStatus('IN_PROGRESS')
  }

  requestReview() {
    if (this.value === 'DONE') {
      throw new ProgressAlreadyDoneException()
    }

    return new ProgressStatus('IN_REVIEW')
  }

  complete() {
    if (this.value === 'DONE') {
      throw new ProgressAlreadyDoneException()
    }

    return new ProgressStatus('DONE')
  }
}

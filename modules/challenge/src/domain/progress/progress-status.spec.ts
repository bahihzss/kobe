import { ProgressAlreadyDoneException } from '@domain/progress/progress-already-done.exception'
import { ProgressStatus } from '@domain/progress/progress-status'
import { DomainException, DomainValidationError } from '@kobe/common/domain'

describe('ProgressStatus', () => {
  test('引数にステータスを渡すと、そのステータスが作成される', () => {
    expect(new ProgressStatus('TODO').value).toBe('TODO')
    expect(new ProgressStatus('IN_PROGRESS').value).toBe('IN_PROGRESS')
    expect(new ProgressStatus('IN_REVIEW').value).toBe('IN_REVIEW')
    expect(new ProgressStatus('DONE').value).toBe('DONE')
  })

  test('TODO ステータスが取得できる', () => {
    expect(ProgressStatus.todo).toEqual(new ProgressStatus('TODO'))
  })

  test('引数に不正なステータスを渡すとエラーが発生する', () => {
    const act = () => new ProgressStatus('INVALID_STATUS' as any)

    expect(act).toThrow(DomainValidationError)
    expect(act).toThrow('INVALID_STATUS は不正な進捗ステータスです')
  })

  test('課題を開始できる', () => {
    const status = new ProgressStatus('TODO')

    expect(status.start().value).toBe('IN_PROGRESS')
  })

  test('完了済みだと課題を開始できない', () => {
    const status = new ProgressStatus('DONE')

    expect(() => status.start()).toThrow(ProgressAlreadyDoneException)
  })

  test('課題のレビューを依頼する', () => {
    const status = new ProgressStatus('IN_PROGRESS')

    expect(status.requestReview().value).toBe('IN_REVIEW')
  })

  test('完了済みだと課題のレビューを依頼できない', () => {
    const status = new ProgressStatus('DONE')

    expect(() => status.requestReview()).toThrow(ProgressAlreadyDoneException)
  })

  test('課題を完了できる', () => {
    const status = new ProgressStatus('IN_PROGRESS')

    expect(status.complete().value).toBe('DONE')
  })

  test('完了済みだと課題を完了できない', () => {
    const status = new ProgressStatus('DONE')

    expect(() => status.complete()).toThrow(ProgressAlreadyDoneException)
  })

  test('equals で等価性を判定できる：等しい場合', () => {
    const status1 = new ProgressStatus('TODO')
    const status2 = new ProgressStatus('TODO')

    expect(status1.equals(status2)).toBe(true)
  })

  test('equals で等価性を判定できる：異なる場合', () => {
    const status1 = new ProgressStatus('TODO')
    const status2 = new ProgressStatus('IN_PROGRESS')

    expect(status1.equals(status2)).toBe(false)
  })
})

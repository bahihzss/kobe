import { ParticipantStatus } from '@domain/participant/models/participant-status'
import { DomainValidationError } from '@kobe/common/domain'

describe('ParticipantStatus', () => {
  test('正しいステータスを扱える', () => {
    expect(new ParticipantStatus('在籍中').value).toBe('在籍中')
  })

  test('不正なステータスを渡すとエラーになる', () => {
    const act = () => {
      new ParticipantStatus('invalid' as any)
    }
    expect(act).toThrow(DomainValidationError)
    expect(act).toThrow('invalid は正しいステータスではありません。')
  })

  test('在籍中の各ステータスを取得できる', () => {
    expect(ParticipantStatus.enrolled).toEqual(new ParticipantStatus('在籍中'))
    expect(ParticipantStatus.suspended).toEqual(new ParticipantStatus('休会中'))
    expect(ParticipantStatus.resigned).toEqual(new ParticipantStatus('退会済'))
  })

  test('ステータスの比較ができる', () => {
    expect(new ParticipantStatus('在籍中').equals(new ParticipantStatus('在籍中'))).toBe(true)
    expect(new ParticipantStatus('在籍中').equals(new ParticipantStatus('休会中'))).toBe(false)
  })
})

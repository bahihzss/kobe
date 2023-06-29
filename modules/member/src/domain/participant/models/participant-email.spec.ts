import { ParticipantEmail } from '@domain/participant/models/participant-email'
import { DomainValidationError } from '@kobe/common/domain'

describe('ParticipantEmail', () => {
  test('正しいメールアドレスを扱える', () => {
    expect(new ParticipantEmail('info@example.com').value).toBe('info@example.com')
  })

  test('正しくないメールアドレスを扱うとエラーになる', () => {
    const act = () => {
      new ParticipantEmail('invalid')
    }
    expect(act).toThrow(DomainValidationError)
    expect(act).toThrow('invalid は正しいメールの形式ではありません。')
  })

  test('等価性を判断できる', () => {
    const email1 = new ParticipantEmail('info1@example.com')
    const otherEmail1 = new ParticipantEmail('info1@example.com')
    const email2 = new ParticipantEmail('info2@example.com')

    expect(email1.equals(otherEmail1)).toBe(true)
    expect(email1.equals(email2)).toBe(false)
  })
})

import { PairName } from '@domain/pair/models/pair-name'
import { DomainValidationError } from '@kobe/common/domain'
import { DomainException } from '@kobe/common/domain/error'

describe('PairName', () => {
  test('a,b,c,d のような１文字のアルファベットの小文字をセットできる', () => {
    const pairName = new PairName('a')
    expect(pairName.value).toBe('a')
  })

  test('引数にペア名以外は渡せない', () => {
    const act = () => new PairName('1')

    expect(act).toThrow(DomainValidationError)
    expect(act).toThrow(`1 は不正なペア名です。ペア名は 1 文字のアルファベットの小文字である必要があります`)
  })

  test('first で最初のペア名を取得できる', () => {
    expect(PairName.first).toEqual(new PairName('a'))
  })

  test('next で次のペア名を取得できる', () => {
    const pairName = new PairName('a')
    expect(pairName.next).toEqual(new PairName('b'))
  })

  test('z 以上のペア名は作れない', () => {
    const lastPairName = new PairName('z')

    const act = () => lastPairName.next

    expect(act).toThrow(DomainException)
    expect(act).toThrow(`ペア名は z までです`)
  })

  test('equals で同じペア名かどうかを判定できる', () => {
    const pairName = new PairName('a')
    const otherPairName = new PairName('a')

    expect(pairName.equals(otherPairName)).toBe(true)
  })
})

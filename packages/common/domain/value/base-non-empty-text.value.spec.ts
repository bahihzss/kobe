import { BaseNonEmptyText } from './base-non-empty-text.value'

describe('BaseNonEmptyText', () => {
  class SampleName extends BaseNonEmptyText {
    type = 'SampleName' as const
    protected get label() {
      return 'サンプル名'
    }
  }

  test('引数に文字列を渡すとその文字列がセットされる', () => {
    const actual = new SampleName('sample-name')
    expect(actual.value).toBe('sample-name')
  })

  test('引数に空文字を渡すとエラーが発生する', () => {
    expect(() => new SampleName('')).toThrow(
      new Error(' は不正なサンプル名です。サンプル名は１文字以上の文字列である必要があります'),
    )
  })

  test('equals で等価性を判定できる', () => {
    const name1 = new SampleName('sample-name')
    const name2 = new SampleName('sample-name')
    const name3 = new SampleName('other-name')

    expect(name1.equals(name2)).toBe(true)
    expect(name1.equals(name3)).toBe(false)
  })
})

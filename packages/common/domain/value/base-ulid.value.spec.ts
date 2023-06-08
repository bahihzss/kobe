import { BaseUlid } from './base-ulid.value'
import { DomainValidationError } from '../error'
import { patterns } from '@kobe/patterns'

describe('BaseUlid', () => {
  const SampleId = class extends BaseUlid {
    type = 'SampleId' as const
  }

  test('引数なしで new すると新しい ULID が生成される', () => {
    const actualId = new SampleId()

    expect(actualId.value).toMatch(patterns.ulid)
  })

  test('引数に ULID を渡すとその ULID がセットされる', () => {
    const expectedIdString = '01F7X1Z1B1P2QZ4QX5ZQXZ7Z0V'
    const actualId = new SampleId(expectedIdString)

    expect(actualId.value).toBe(expectedIdString)
  })

  test('引数に ULID 以外を渡すとエラーが発生する', () => {
    expect(() => new SampleId('invalid-id')).toThrow(new DomainValidationError('invalid-id は不正な ULID です'))
  })

  test('equals で等価性を判定できる', () => {
    const id1 = new SampleId()
    const id2 = new SampleId(id1.value)
    const id3 = new SampleId()

    expect(id1.equals(id2)).toBe(true)
    expect(id1.equals(id3)).toBe(false)
  })
})

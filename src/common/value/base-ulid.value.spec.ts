import { BaseUlid } from './base-ulid.value'
import { DomainValidationError } from '../error/domain-validation.error'
import { regexp } from '@common/constant/regexp'

describe('BaseUlid のテスト', () => {
  const SampleId = class extends BaseUlid {}

  test('引数なしで new すると新しい ULID が生成される', () => {
    const actualId = new SampleId()

    expect(actualId.value).toMatch(regexp.ulid)
  })

  test('引数に ULID を渡すとその ULID がセットされる', () => {
    const expectedIdString = '01F7X1Z1B1P2QZ4QX5ZQXZ7Z0V'
    const actualId = new SampleId(expectedIdString)

    expect(actualId.value).toBe(expectedIdString)
  })

  test('引数に ULID 以外を渡すとエラーが発生する', () => {
    expect(() => new SampleId('invalid-id')).toThrow(
      new DomainValidationError('invalid-id は不正な ULID です'),
    )
  })
})

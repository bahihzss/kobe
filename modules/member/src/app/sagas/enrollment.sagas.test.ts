import { Test } from '@nestjs/testing'

describe('EnrollmentSagas', () => {
  beforeEach(() => {
    const testApp = Test.createTestingModule({})
  })

  test('ユーザーを登録すると、自動的に空いているチームに追加される', () => {})
})

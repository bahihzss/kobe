import { ParticipantEmail } from '@domain/participant/models'
import { EmailDuplicatedException } from '@domain/participant/services/email-duplicated.exception'
import { EmailDuplicationChecker } from '@domain/participant/services/email-duplication-checker'
import { ParticipantFirestoreRepository } from '@infra/repository'
import { PrismaSeeder } from '@infra/seeder'
import { FirebaseModule } from '@kobe/firebase'
import { clearFirestore } from '@kobe/firebase/testing'
import { Test } from '@nestjs/testing'
import { Token } from '@root/token'

describe('EmailDuplicationChecker', () => {
  let checker: EmailDuplicationChecker

  beforeEach(async () => {
    await clearFirestore()

    const testApp = await Test.createTestingModule({
      imports: [FirebaseModule],
      providers: [
        PrismaSeeder,
        {
          provide: Token.ParticipantRepository,
          useClass: ParticipantFirestoreRepository,
        },
        EmailDuplicationChecker,
      ],
    }).compile()

    await testApp.get(PrismaSeeder).seed()

    checker = testApp.get(EmailDuplicationChecker)
  })

  test('存在する場合は例外を投げる', () => {
    const email = new ParticipantEmail('taro.yamada@example.com')

    return expect(() => checker.throwIfDuplicate(email)).rejects.toThrow(EmailDuplicatedException)
  })
})

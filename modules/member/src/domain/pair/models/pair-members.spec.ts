import { PairMembers } from '@domain/pair/models/pair-members'
import { ParticipantId } from '@domain/participant/models'
import { Faker } from '@domain/utils'
import { DomainException } from '@kobe/common/domain'

describe('PairMembers', () => {
  test('参加者 ID を配列で渡すと作成できる', () => {
    const memberIds = Faker.participantIdArray(2)

    const actualPairMembers = new PairMembers(memberIds)

    const serialized = actualPairMembers.serialize()
    expect(serialized.length).toBe(2)
    expect(serialized).toEqual(expect.arrayContaining([memberIds[0].value, memberIds[1].value]))
  })

  test('２人未満のペアは作成できない', () => {
    const memberIds = Faker.participantIdArray(1)
    const act = () => new PairMembers(memberIds)

    expect(act).toThrow(DomainException)
    expect(act).toThrow(`メンバー数は最低 2 人必要です`)
  })

  test('４人以上のペアは作成できない', () => {
    const memberIds = Faker.participantIdArray(4)
    const act = () => new PairMembers(memberIds)

    expect(act).toThrow(DomainException)
    expect(act).toThrow(`メンバー数は最大 3 人までです`)
  })

  test('重複して参加することはできない', () => {
    const participantId = new ParticipantId()

    const act = () => new PairMembers([participantId, participantId])

    expect(act).toThrow(DomainException)
    expect(act).toThrow(`重複した参加者がいます`)
  })

  test('メンバーを追加できる', () => {
    const memberIds = Faker.participantIdArray(2)
    const pairMembers = new PairMembers(memberIds)
    const newMemberId = new ParticipantId()

    const actualPairMembers = pairMembers.add(newMemberId)

    const serialized = actualPairMembers.serialize()
    expect(serialized.length).toBe(3)
    expect(serialized).toEqual(expect.arrayContaining([newMemberId.value]))
  })

  test('メンバーを削除できる', () => {
    const memberIds = Faker.participantIdArray(3)
    const pairMembers = new PairMembers(memberIds)
    const leavingMemberId = memberIds[0]

    const actualPairMembers = pairMembers.remove(leavingMemberId)

    const serialized = actualPairMembers.serialize()
    expect(serialized.length).toBe(2)
    expect(serialized).not.toEqual(expect.arrayContaining([leavingMemberId.value]))
  })

  test('存在しないメンバーは削除できない', () => {
    const memberIds = Faker.participantIdArray(3)
    const pairMembers = new PairMembers(memberIds)
    const nonMemberId = new ParticipantId()

    const act = () => pairMembers.remove(nonMemberId)

    expect(act).toThrow(DomainException)
    expect(act).toThrow(`${nonMemberId.value} は在籍していません`)
  })
})

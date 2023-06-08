import { ParticipantId } from '@domain/participant/models'
import { TeamMembers } from '@domain/team/models/team-members'
import { Faker } from '@domain/utils'
import { DomainException } from '@kobe/common/domain/error'

describe('TeamMembers', () => {
  test('参加者 ID を配列で渡すと作成できる', () => {
    const teamMembers = TeamMembers.create([new ParticipantId(), new ParticipantId(), new ParticipantId()])

    expect(teamMembers.count).toBe(3)
  })

  test('３人未満のチームは作成できない', () => {
    const act = () => TeamMembers.create([new ParticipantId(), new ParticipantId()])

    expect(act).toThrow(DomainException)
    expect(act).toThrow(`メンバー数は最低 3 人必要です`)
  })

  test('add に 参加者 ID を渡すとメンバーを追加できる', () => {
    const memberIds = Faker.participantIdArray(3)
    const teamMembers = TeamMembers.create(memberIds)
    const newMemberIds = new ParticipantId()

    const actualTeamMembers = teamMembers.add(newMemberIds)

    expect(actualTeamMembers.count).toBe(4)
  })

  test('remove に 参加者 ID を渡すとメンバーを削除できる', () => {
    const memberIds = Faker.participantIdArray(4)
    const teamMembers = TeamMembers.create(memberIds)
    const leavingMemberId = memberIds[0]

    const actualTeamMembers = teamMembers.remove(leavingMemberId)

    expect(actualTeamMembers.count).toBe(3)
  })

  test('２人以下になる remove はできない', () => {
    const memberIds = Faker.participantIdArray(3)
    const teamMembers = TeamMembers.create(memberIds)
    const leavingMemberId = memberIds[0]

    const act = () => teamMembers.remove(leavingMemberId)

    expect(act).toThrow(DomainException)
    expect(act).toThrow('メンバー数が 3 人を下回ってしまいます')
  })

  test('存在しない参加者は remove できない', () => {
    const memberIds = Faker.participantIdArray(3)
    const teamMembers = TeamMembers.create(memberIds)
    const nonMemberId = new ParticipantId()

    const act = () => teamMembers.remove(nonMemberId)

    expect(act).toThrow(DomainException)
    expect(act).toThrow(`${nonMemberId.value} は在籍していないです`)
  })
})

import { TeamName } from '@domain/team/models'
import { DomainValidationError } from '@kobe/common/domain'
import { DomainException } from '@kobe/common/domain/error'

describe('TeamName', () => {
  test('引数にチーム名を渡すとチーム名がセットされる', () => {
    const teamName = new TeamName('1')
    expect(teamName.value).toBe('1')
  })

  test('引数にチーム名以外は渡せない', () => {
    const act = () => new TeamName('invalid-name')

    expect(act).toThrow(DomainValidationError)
    expect(act).toThrow(
      'invalid-name は不正なチーム名です。チーム名は 1 以上 999 以下の整数の文字列である必要があります',
    )
  })

  test('first で最初のチーム名を取得できる', () => {
    expect(TeamName.first).toEqual(new TeamName('1'))
  })

  test('next で次のチーム名を取得できる', () => {
    const teamName = new TeamName('1')
    expect(teamName.next).toEqual(new TeamName('2'))
  })

  test('1000 以上のチームは作れない', () => {
    const lastTeamName = new TeamName('999')

    const act = () => lastTeamName.next

    expect(act).toThrow(DomainException)
    expect(act).toThrow('チーム数は 999 までです')
  })

  test('等価性を判定できる', () => {
    const teamName1 = new TeamName('1')
    const teamName2 = new TeamName('1')
    const teamName3 = new TeamName('2')

    expect(teamName1.equals(teamName2)).toBe(true)
    expect(teamName1.equals(teamName3)).toBe(false)
  })
})

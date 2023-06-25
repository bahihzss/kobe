import { Participant } from '@domain/participant/participant'
import { ParticipantId } from '@domain/participant/participant-id'
import { ParticipantName } from '@domain/participant/participant-name'
import { patterns } from '@kobe/patterns'

describe('Participant', () => {
  test('名前から作成できる', () => {
    const newParticipant = Participant.create({ name: new ParticipantName('Matsubara Shunya') })

    const serialized = newParticipant.serialize()
    expect(serialized).toEqual({
      id: expect.stringMatching(patterns.ulid),
      name: 'Matsubara Shunya',
    })
  })

  test('永続化されたデータからインスタンスを再構築できる', () => {
    const participant = Participant.reconstruct({
      id: new ParticipantId('01H3S0M18M1T58QN07ZKPTQC54'),
      name: new ParticipantName('Matsubara Shunya'),
    })

    const serialized = participant.serialize()
    expect(serialized).toEqual({
      id: '01H3S0M18M1T58QN07ZKPTQC54',
      name: 'Matsubara Shunya',
    })
  })

  test('等価性を判定できる：等しい場合', () => {
    const participant1 = Participant.reconstruct({
      id: new ParticipantId('01H3S0M18M1T58QN07ZKPTQC54'),
      name: new ParticipantName('Matsubara Shunya'),
    })
    const otherParticipant1 = Participant.reconstruct({
      id: new ParticipantId('01H3S0M18M1T58QN07ZKPTQC54'),
      name: new ParticipantName('Matsubara Shunya'),
    })

    expect(participant1.equals(otherParticipant1)).toBe(true)
  })

  test('等価性を判定できる：等しくない場合', () => {
    const participant1 = Participant.reconstruct({
      id: new ParticipantId('01H3S0M18M1T58QN07ZKPTQC54'),
      name: new ParticipantName('Matsubara Shunya'),
    })
    const participant2 = Participant.reconstruct({
      id: new ParticipantId('01H3S0VYYE1VERDJK4SDZX53DZ'),
      name: new ParticipantName('Awata Kyosuke'),
    })

    expect(participant1.equals(participant2)).toBe(false)
  })
})

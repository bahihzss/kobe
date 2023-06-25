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
})

import {
  Participant,
  ParticipantId,
} from '@/member/domain/participant/participant.entity'

describe('Participant のテスト', () => {
  test('参加者を登録できる', () => {
    const [participant, participantEnrolledEvent] = Participant.enroll({
      name: 'Hikaru Inafune',
    })

    expect(participant.snapshot).toEqual({
      id: expect.any(ParticipantId),
      name: 'Hikaru Inafune',
    })

    expect(participantEnrolledEvent).toEqual({
      id: expect.any(ParticipantId),
      name: 'Hikaru Inafune',
    })
  })
})

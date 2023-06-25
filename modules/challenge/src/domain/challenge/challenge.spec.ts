import { Challenge } from '@domain/challenge/challenge'
import { ChallengeDescription } from '@domain/challenge/challenge-description'
import { ChallengeId } from '@domain/challenge/challenge-id'
import { ChallengeTitle } from '@domain/challenge/challenge-title'
import { patterns } from '@kobe/patterns'

describe('Challenge', () => {
  test('名前と説明文から作成できる', () => {
    const newChallenge = Challenge.create({
      title: new ChallengeTitle('DBモデリング1'),
      description: new ChallengeDescription('お寿司屋さんのシステムのDBを設計してください。'),
    })

    const serialized = newChallenge.serialize()
    expect(serialized).toEqual({
      id: expect.stringMatching(patterns.ulid),
      title: 'DBモデリング1',
      description: 'お寿司屋さんのシステムのDBを設計してください。',
    })
  })

  test('永続化されたデータからインスタンスを再構築できる', () => {
    const participant = Challenge.reconstruct({
      id: new ChallengeId('01H3S1SBQ71XMHE8ZR9AMVNVKR'),
      title: new ChallengeTitle('DBモデリング1'),
      description: new ChallengeDescription('お寿司屋さんのシステムのDBを設計してください。'),
    })

    const serialized = participant.serialize()
    expect(serialized).toEqual({
      id: '01H3S1SBQ71XMHE8ZR9AMVNVKR',
      title: 'DBモデリング1',
      description: 'お寿司屋さんのシステムのDBを設計してください。',
    })
  })
})

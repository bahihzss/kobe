import { ChallengeId } from '@domain/challenge'
import { ParticipantId } from '@domain/participant'
import { Progress } from '@domain/progress/progress'
import { ProgressId } from '@domain/progress/progress-id'
import { ProgressInvalidOperatorException } from '@domain/progress/progress-invalid-operator.exception'
import { ProgressStatus } from '@domain/progress/progress-status'
import { patterns } from '@kobe/patterns'

describe('Progress', () => {
  test('課題を参加者に割り当てて進捗を作成できる', () => {
    const newProgress = Progress.assign({
      assigneeId: new ParticipantId('01H3S57SMZMS646Z273EQV6D2T'),
      challengeId: new ChallengeId('01H3S58CHCG3P49SZ19N8XJQ92'),
    })

    const serialized = newProgress.serialize()
    expect(serialized).toEqual({
      status: 'TODO',
      assigneeId: '01H3S57SMZMS646Z273EQV6D2T',
      challengeId: '01H3S58CHCG3P49SZ19N8XJQ92',
    })
  })

  test('永続化されたデータからインスタンスを再構築できる', () => {
    const progress = Progress.reconstruct({
      status: new ProgressStatus('TODO'),
      assigneeId: new ParticipantId('01H3S57SMZMS646Z273EQV6D2T'),
      challengeId: new ChallengeId('01H3S58CHCG3P49SZ19N8XJQ92'),
    })

    const serialized = progress.serialize()
    expect(serialized).toEqual({
      status: 'TODO',
      assigneeId: '01H3S57SMZMS646Z273EQV6D2T',
      challengeId: '01H3S58CHCG3P49SZ19N8XJQ92',
    })
  })

  test('課題を開始できる', () => {
    const progress = Progress.assign({
      assigneeId: new ParticipantId('01H3S57SMZMS646Z273EQV6D2T'),
      challengeId: new ChallengeId('01H3S58CHCG3P49SZ19N8XJQ92'),
    })

    const startedProgress = progress.start({
      operatorId: new ParticipantId('01H3S57SMZMS646Z273EQV6D2T'),
    })

    const serialized = startedProgress.serialize()
    expect(serialized.status).toEqual('IN_PROGRESS')
  })

  test('課題は本人しか開始できない', () => {
    const progress = Progress.assign({
      assigneeId: new ParticipantId('01H3S57SMZMS646Z273EQV6D2T'),
      challengeId: new ChallengeId('01H3S58CHCG3P49SZ19N8XJQ92'),
    })

    const act = () => {
      progress.start({
        operatorId: new ParticipantId('01H3S72HR8RBPXD9SAEMBRWRE9'),
      })
    }

    expect(act).toThrow(ProgressInvalidOperatorException)
  })

  test('課題のレビューをリクエストできる', () => {
    const progress = Progress.assign({
      assigneeId: new ParticipantId('01H3S57SMZMS646Z273EQV6D2T'),
      challengeId: new ChallengeId('01H3S58CHCG3P49SZ19N8XJQ92'),
    })

    const reviewRequestedProgress = progress.requestReview({
      operatorId: new ParticipantId('01H3S57SMZMS646Z273EQV6D2T'),
    })

    const serialized = reviewRequestedProgress.serialize()
    expect(serialized.status).toEqual('IN_REVIEW')
  })

  test('本人しか課題のレビューをリクエストできない', () => {
    const progress = Progress.assign({
      assigneeId: new ParticipantId('01H3S57SMZMS646Z273EQV6D2T'),
      challengeId: new ChallengeId('01H3S58CHCG3P49SZ19N8XJQ92'),
    })

    const act = () => {
      progress.requestReview({
        operatorId: new ParticipantId('01H3S72HR8RBPXD9SAEMBRWRE9'),
      })
    }

    expect(act).toThrow(ProgressInvalidOperatorException)
  })

  test('課題のレビューを完了できる', () => {
    const progress = Progress.assign({
      assigneeId: new ParticipantId('01H3S57SMZMS646Z273EQV6D2T'),
      challengeId: new ChallengeId('01H3S58CHCG3P49SZ19N8XJQ92'),
    })

    const completedProgress = progress.complete({
      operatorId: new ParticipantId('01H3S57SMZMS646Z273EQV6D2T'),
    })

    const serialized = completedProgress.serialize()
    expect(serialized.status).toEqual('DONE')
  })

  test('本人しか課題を完了できない', () => {
    const progress = Progress.assign({
      assigneeId: new ParticipantId('01H3S57SMZMS646Z273EQV6D2T'),
      challengeId: new ChallengeId('01H3S58CHCG3P49SZ19N8XJQ92'),
    })

    const act = () => {
      progress.complete({
        operatorId: new ParticipantId('01H3S72HR8RBPXD9SAEMBRWRE9'),
      })
    }

    expect(act).toThrow(ProgressInvalidOperatorException)
  })
})

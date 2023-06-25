import { BaseNonEmptyText } from '@kobe/common/domain'

export class ChallengeTitle extends BaseNonEmptyText {
  type = 'ChallengeTitle' as const

  get label() {
    return '課題のタイトル'
  }
}

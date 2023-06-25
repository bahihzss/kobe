import { BaseNonEmptyText } from '@kobe/common/domain'

export class ChallengeDescription extends BaseNonEmptyText {
  type = 'ChallengeDescription' as const

  get label() {
    return '課題説明'
  }
}

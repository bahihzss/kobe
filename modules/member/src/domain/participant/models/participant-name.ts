import { BaseNonEmptyText } from '@kobe/common/domain'

export class ParticipantName extends BaseNonEmptyText {
  type = 'ParticipantName' as const
  get label() {
    return '参加者名'
  }
}

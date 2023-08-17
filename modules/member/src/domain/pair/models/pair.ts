import { PairCreated } from '@domain/pair/events'
import { PairMemberAdded } from '@domain/pair/events/pair-member-added'
import { PairId, PairName } from '@domain/pair/models'
import { PairMembers } from '@domain/pair/models/pair-members'
import { ParticipantId } from '@domain/participant/models'
import { TeamId } from '@domain/team/models'
import { IEntity } from '@kobe/common/domain'

export class Pair implements IEntity {
  private constructor(
    private readonly id: PairId,
    private readonly name: PairName,
    private readonly teamId: TeamId,
    private readonly members: PairMembers,
  ) {}

  static create(args: { members: PairMembers; teamId: TeamId; latestPair?: Pair }) {
    const pairName = args.latestPair ? args.latestPair.name.next : PairName.first

    const event = new PairCreated(pairName, args.teamId, args.members)
    const pair = this.prototype.onCreated(event)

    return [pair, event] as const
  }

  onCreated(event: PairCreated): Pair {
    return new Pair(event.pairId, event.name, event.teamId, event.members)
  }

  addMember(participantId: ParticipantId) {
    const event = new PairMemberAdded(this.id, participantId)
    const pair = this.onMemberAdded(event)

    return [pair, event] as const
  }

  onMemberAdded(event: PairMemberAdded): Pair {
    return new Pair(this.id, this.name, this.teamId, this.members.add(event.newMemberId))
  }

  equals(other: Pair): boolean {
    return this.id.equals(other.id)
  }

  static reconstruct({
    id,
    name,
    teamId,
    members,
  }: {
    id: PairId
    name: PairName
    teamId: TeamId
    members: PairMembers
  }): Pair {
    return new Pair(id, name, teamId, members)
  }

  serialize() {
    return {
      id: this.id.value,
      name: this.name.value,
      teamId: this.teamId.value,
      members: this.members.serialize(),
    }
  }
}

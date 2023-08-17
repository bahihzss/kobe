import { Pair } from '@domain/pair/models'
import { PairMembers } from '@domain/pair/models/pair-members'
import { Participant, ParticipantEmail, ParticipantId, ParticipantName } from '@domain/participant/models'
import { Team } from '@domain/team/models'
import { TeamMembers } from '@domain/team/models/team-members'

const idVariant = ['1', '2', '3', 'A', 'B', 'C', 'Z'] as const
type IdVariant = typeof idVariant[number]

const ulid = (fillString: IdVariant) => {
  return `0${fillString.repeat(25)}`
}

const participantIdArray = (count: number) => {
  return Array.from({ length: count }, () => new ParticipantId())
}

const teamMembers = (count = 3) => {
  return new TeamMembers(participantIdArray(count))
}

const team = (memberCount = 3) => {
  const members = teamMembers(memberCount)
  const [team] = Team.create({ members })

  return team
}

const participant = (params: { name?: string; email?: string } = {}) => {
  const [participant] = Participant.enroll({
    name: new ParticipantName(params.name ?? 'Norio Yamashita'),
    email: new ParticipantEmail(params.email ?? 'yamashita@example.com'),
  })

  return participant
}

const pairMembers = (count = 2) => {
  return new PairMembers(participantIdArray(count))
}

const pair = (memberCount: 2 | 3 = 2) => {
  const team = Faker.team(memberCount * 2)
  const members = new PairMembers(
    team
      .serialize()
      .members.slice(0, memberCount)
      .map((id) => new ParticipantId(id)),
  )
  const [pair] = Pair.create({ members, teamId: team.id })

  return pair
}

export const Faker = {
  ulid,
  participant,
  participantIdArray,
  teamMembers,
  team,
  pairMembers,
  pair,
}

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

export const Faker = {
  ulid,
  participant,
  participantIdArray,
  teamMembers,
  team,
}

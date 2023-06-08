import { ParticipantId } from '@domain/participant/models'
import { Team } from '@domain/team/models'
import { TeamMembers } from '@domain/team/models/team-members'

const idVariant = ['1', '2', '3', 'A', 'B', 'C', 'Z'] as const
type IdVariant = typeof idVariant[number]

export const ulid = (fillString: IdVariant) => {
  return `0${fillString.repeat(25)}`
}

export const participantIdArray = (count: number) => {
  return Array.from({ length: count }, () => new ParticipantId())
}

export const teamMembers = (count = 3) => {
  return new TeamMembers(participantIdArray(count))
}

export const team = () => {
  const members = teamMembers()
  const [team] = Team.create({ members })

  return team
}

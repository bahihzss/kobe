import { TeamEvent } from '@domain/team/events'
import { TeamId, Team } from '@domain/team/models'

export interface TeamRepository {
  store(team: Team, teamEvent: TeamEvent): Promise<void>
  findById(teamId: TeamId): Promise<Team | undefined>
  findLatest(): Promise<Team | undefined>
}

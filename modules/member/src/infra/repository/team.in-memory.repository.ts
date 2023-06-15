/* istanbul ignore file */

import { TeamEvent } from '@domain/team/events'
import { TeamRepository } from '@domain/team/interfaces'
import { Team, TeamId } from '@domain/team/models'

type TeamMeta = {
  team: Team
  events: TeamEvent[]
}

type TeamMap = Record<string, TeamMeta>

export class TeamInMemoryRepository implements TeamRepository {
  constructor(public teamMap: TeamMap = {}) {}

  get teams() {
    return Object.values(this.teamMap).map(({ team }) => team)
  }

  set teams(teams: Team[]) {
    this.teamMap = teams.reduce((sub, team) => {
      sub[team.serialize().id] = { team, events: [] }
      return sub
    }, {} as TeamMap)
  }

  get events() {
    return Object.values(this.teamMap)
      .map(({ events }) => events)
      .flat()
  }

  waitNext<T extends TeamEvent>(type: string): Promise<T> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const event = this.events.find((event) => event.serialize().type === type)

        if (event) {
          clearInterval(interval)
          resolve(event as T)
        }
      }, 10)
    })
  }

  async store(team: Team, teamEvent: TeamEvent) {
    const currentTeamMeta = this.teamMap[teamEvent.teamId.value] ?? { events: [] }

    this.teamMap[teamEvent.teamId.value] = {
      ...currentTeamMeta,
      team,
      events: [...currentTeamMeta.events, teamEvent],
    }
  }

  async findById(teamId: TeamId) {
    return this.teamMap[teamId.value]?.team
  }

  async findLatest() {
    return this.teams.slice(-1)[0]
  }

  async findAll() {
    return this.teams
  }
}

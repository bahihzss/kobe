import { TeamRepository } from '@domain/team/interfaces'
import { Team } from '@domain/team/models'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class OpenTeamFinder {
  constructor(
    @Inject('TeamRepository')
    private teamRepository: TeamRepository,
  ) {}

  async find() {
    const allTeams = await this.teamRepository.findAll()
    const firstOpenTeam = this.getFirstOpenTeam(allTeams)
    const openTeams = this.getAllOpenTeams(allTeams, firstOpenTeam)

    return this.getRandomOneTeam(openTeams)
  }

  private getFirstOpenTeam(teams: Team[]) {
    return teams.sort((teamA, teamB) => teamA.compareWith(teamB))[0]
  }

  private getAllOpenTeams(teams: Team[], firstOpenTeam: Team) {
    return teams.filter((team) => team.hasSameMemberCount(firstOpenTeam))
  }

  private getRandomOneTeam(teams: Team[]) {
    const randomIndex = Math.floor(Math.random() * teams.length)
    return teams[randomIndex]
  }
}

import { TeamRepository } from '@domain/team/interfaces'
import { Team } from '@domain/team/models'
import { randomOne } from '@domain/utils/randomOne'
import { DomainException } from '@kobe/common/domain'
import { Inject, Injectable } from '@nestjs/common'
import { Token } from '@root/token'

@Injectable()
export class OpenTeamFinder {
  constructor(
    @Inject(Token.TeamRepository)
    private teamRepository: TeamRepository,
  ) {}

  async find() {
    const allTeams = await this.teamRepository.findAll()

    if (allTeams.length === 0) {
      throw new DomainException('登録されているチームがありません')
    }

    const firstOpenTeam = this.getFirstOpenTeam(allTeams)
    const openTeams = this.getAllOpenTeams(allTeams, firstOpenTeam)

    return randomOne(openTeams)
  }

  private getFirstOpenTeam(teams: Team[]) {
    return [...teams].sort((teamA, teamB) => teamA.compareWith(teamB))[0]
  }

  private getAllOpenTeams(teams: Team[], firstOpenTeam: Team) {
    return teams.filter((team) => team.hasSameMemberCount(firstOpenTeam))
  }
}

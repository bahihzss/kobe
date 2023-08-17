import { PairRepository } from '@domain/pair/interfaces'
import { NonOpenPairException } from '@domain/pair/service/non-open-pair.exception'
import { TeamId } from '@domain/team/models'
import { randomOne } from '@domain/utils/randomOne'
import { DomainException } from '@kobe/common/domain'
import { Inject, Injectable } from '@nestjs/common'
import { Token } from '@root/token'

@Injectable()
export class OpenPairFinder {
  constructor(
    @Inject(Token.PairRepository)
    private readonly pairRepository: PairRepository,
  ) {}

  async find(teamId: TeamId) {
    const pairsInTeam = await this.pairRepository.findManyByTeamId(teamId)

    if (pairsInTeam.length === 0) {
      throw new DomainException('指定されたチームが存在しません')
    }

    const openPairs = pairsInTeam.filter((pair) => pair.isOpen)

    if (openPairs.length === 0) {
      throw new NonOpenPairException()
    }

    return randomOne(openPairs)
  }
}

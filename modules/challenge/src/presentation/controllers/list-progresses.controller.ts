import { ListProgressesUseCase } from '@app/use-case/list-progresses-use.case'
import { Controller, Get, HttpCode, Query } from '@nestjs/common'
import { IsULID } from '@yuzu441/is-ulid'
import { IsIn, IsInt } from 'class-validator'

export class ListProgressesQueryParam {
  @IsULID({ each: true })
  challengeIds!: string[]

  @IsIn(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'])
  status!: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'

  @IsInt()
  page!: number
}

@Controller('/progresses')
export class ListProgressesController {
  constructor(private readonly listProgressesUseCase: ListProgressesUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Query() query: ListProgressesQueryParam) {
    const progresses = await this.listProgressesUseCase.execute({
      challengeIds: query.challengeIds,
      status: query.status,
      page: query.page,
    })

    return {
      ...progresses,
    }
  }
}

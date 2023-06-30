import { PrismaSeeder } from '@infra/prisma.seeder'
import { Controller, Post } from '@nestjs/common'

@Controller('/challenge/refresh')
export class RefreshController {
  constructor(private seeder: PrismaSeeder) {}

  @Post()
  async handle() {
    await this.seeder.seed()

    return {
      statusCode: 200,
      status: 'ok',
    }
  }
}

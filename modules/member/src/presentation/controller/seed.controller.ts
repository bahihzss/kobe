import { MemberSeeder } from '@infra/seeder'
import { Controller, Post } from '@nestjs/common'

@Controller('seed')
export class SeedController {
  constructor(private seeder: MemberSeeder) {}

  @Post()
  async handle() {
    await this.seeder.seed()

    return {
      statusCode: 201,
      status: 'created',
    }
  }
}

import { PrismaSeeder } from '@infra/seeder'
import { clearFirestore } from '@kobe/firebase/testing'
import { Controller, Post } from '@nestjs/common'

@Controller('/member/refresh')
export class RefreshController {
  constructor(private seeder: PrismaSeeder) {}

  @Post()
  async handle() {
    await clearFirestore()
    await this.seeder.seed()

    return {
      statusCode: 201,
      status: 'created',
    }
  }
}

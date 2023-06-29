import { useCases } from '@app/use-case'
import { sagas } from '@domain/sagas'
import { repositories } from '@infra/repository'
import { MemberSeeder } from '@infra/seeder'
import { FirebaseModule } from '@kobe/firebase'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { controllers } from '@presentation/controller'
import { commandHandlers, domainServices } from '@root/domain'

@Module({
  imports: [CqrsModule, FirebaseModule],
  providers: [
    // app
    ...useCases,
    // domain
    ...sagas,
    ...commandHandlers,
    ...domainServices,
    // infra
    ...repositories,
    MemberSeeder,
  ],
  controllers: controllers,
})
export class MemberCommandModule {}

import { useCases } from '@app/use-case'
import { repositories } from '@infra/repository'
import { FirebaseModule } from '@kobe/firebase'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { controllers } from '@presentation/controller'
import { commandHandlers } from '@root/domain'

@Module({
  imports: [CqrsModule, FirebaseModule],
  providers: [
    // app
    ...useCases,
    // domain
    ...commandHandlers,
    // infra
    ...repositories,
  ],
  controllers: controllers,
})
export class MemberCommandModule {}

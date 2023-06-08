import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { FirebaseModule } from '@common/firebase/firebase.module'

@Module({
  imports: [CqrsModule, FirebaseModule],
})
export class MemberModule {}

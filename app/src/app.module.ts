/* istanbul ignore file */
import { FirebaseModule } from '@kobe/firebase'
import { MemberCommandModule } from '@kobe/member'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot(), FirebaseModule, MemberCommandModule],
})
export class AppModule {}
